provider "aws" {
  region = "us-east-1"
  profile = "bigweeb-admin"
}

terraform {
  backend "s3" {
    bucket = "bigweeb-terraform-state"
    key = "services/bigweeb"
    region = "us-east-1"
    dynamodb_table = "terraform-locks"
    encrypt = true
  }
}

locals {
  name = "bigweeb"
}

##############################################################
# Data sources to get VPC, subnets and security group details
##############################################################
data "aws_vpc" "default" {
  id = "vpc-04081161dbcd482c7"
}

data "aws_subnet_ids" "all" {
  vpc_id = data.aws_vpc.default.id
}

data "aws_security_group" "default" {
  vpc_id = data.aws_vpc.default.id
  name = "default"
}

######
# IAM
######

resource "aws_iam_role" "execution_role" {
  name = "${local.name}-execution-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      },
    ]
  })

  inline_policy {
    name = "${local.name}-execution-role-policy"

    policy = jsonencode({
      Version = "2012-10-17"
      Statement = [
        {
          Action = [
            "sqs:*",
            "ecr:GetAuthorizationToken",
            "ecr:BatchCheckLayerAvailability",
            "ecr:GetDownloadUrlForLayer",
            "ecr:GetRepositoryPolicy",
            "ecr:DescribeRepositories",
            "ecr:ListImages",
            "ecr:DescribeImages",
            "ecr:BatchGetImage",
            "rds: *",
            "kms:*",
            "s3:*",
            "ecs:*",
            "ec2:*",
            "cloudwatch:*",
            "logs:*",
            "ssm:*"
          ]
          Effect = "Allow"
          Resource = "*"
        },
      ]
    })
  }

  tags = {
    Environment = "production"
    Service = local.name
  }
}

##########
# Service
##########

module "ecr" {
  source = "lgallard/ecr/aws"
  name = local.name

  tags = {
    Service = local.name
    Environment = "production"
  }
}

resource "aws_cloudwatch_log_group" "service_logs" {
  name = "/ecs/${local.name}"
}

module "task_definition" {
  source = "./modules/ecs"
  family_name = local.name
  service_name = local.name
  cluster_name = "famr-services"
  launch_type = "FARGATE"
  cpu = 1024
  memory = 2048
  task_role_arn = aws_iam_role.execution_role.arn
  execution_role_arn = aws_iam_role.execution_role.arn
  environment_variables = [

    # AUTH0
    {
      name: "TOKEN",
      value: var.TOKEN
    },
    {
      name: "YOUTUBE_API_KEY",
      value: var.YOUTUBE_API_KEY
    },
    {
      name: "SOUNDCLOUD_CLIENT_ID",
      value: var.SOUNDCLOUD_CLIENT_ID
    },
    {
      name: "MAX_PLAYLIST_SIZE",
      value: var.MAX_PLAYLIST_SIZE
    },
    {
      name: "PREFIX",
      value: var.PREFIX
    },
    {
      name: "PRUNING",
      value: var.PRUNING
    },
    {
      name: "SAVE_CLIENT_ID",
      value: var.SAVE_CLIENT_ID
    },
    {
      name: "GOOGLE_APPLICATION_CREDENTIALS",
      value: var.GOOGLE_APPLICATION_CREDENTIALS
    },
  ]

  force_new_deployment = true
  container_name = local.name

  subnets = [
    "subnet-0a80ea45d6d683062"
  ]
  security_group = "sg-00eabe122a50ce1cd"
}
