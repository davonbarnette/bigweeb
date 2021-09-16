provider "aws" {
  region = "us-east-1"
  profile = "famr-admin"
}

terraform {
  backend "s3" {
    bucket         = "famr-terraform-state"
    key            = "global/services/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "terraform-locks"
    encrypt        = true
  }
}

resource "aws_ecs_cluster" "foo" {
  name = "famr-services"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}

