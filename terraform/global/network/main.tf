provider "aws" {
  region = "us-east-1"
  profile = "famr-admin"
}

terraform {
  backend "s3" {
    bucket         = "famr-terraform-state"
    key            = "global/network/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "terraform-locks"
    encrypt        = true
  }
}

######
# VPC
######
resource "aws_vpc" "default" {
  cidr_block = "10.0.0.0/16"
  enable_dns_hostnames = true
}

resource "aws_internet_gateway" "gw" {
  vpc_id = aws_vpc.default.id
}

resource "aws_subnet" "main" {
  vpc_id     = aws_vpc.default.id
  cidr_block = "10.0.0.0/24"
  availability_zone = "us-east-1a"
  map_public_ip_on_launch = true
}

resource "aws_subnet" "alternate" {
  vpc_id     = aws_vpc.default.id
  cidr_block = "10.0.1.0/24"
  availability_zone = "us-east-1b"
  map_public_ip_on_launch = true
}

resource "aws_route_table" "gateway" {
  vpc_id = aws_vpc.default.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.gw.id
  }
}

resource "aws_security_group" "allow_traffic" {
  name        = "Allow Traffic"
  description = "Allow inbound traffic"
  vpc_id      = aws_vpc.default.id

  ingress {
    description      = "Traffic from VPC"
    from_port        = 0
    to_port          = 0
    protocol         = "-1"
    cidr_blocks      = ["0.0.0.0/0"]
  }

  egress {
    from_port        = 0
    to_port          = 0
    protocol         = "-1"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }
}

resource "aws_security_group" "services" {
  name        = "Services"
  description = "Allow inbound traffic for services"
  vpc_id      = aws_vpc.default.id

  ingress {
    description      = "Allow inbound traffic for services"
    from_port        = 0
    to_port          = 0
    protocol         = "-1"
    security_groups = [aws_security_group.allow_traffic.id]
  }

  egress {
    from_port        = 0
    to_port          = 0
    protocol         = "-1"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }
}

######
# ALB
######
resource "aws_lb" "alb" {
  name               = "famr-services-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.allow_traffic.id]
  subnets            = [aws_subnet.main.id, aws_subnet.alternate.id]

  enable_deletion_protection = true
}

resource "aws_alb_listener" "port_redirect" {
  load_balancer_arn = aws_lb.alb.arn
  port = "80"
  protocol = "HTTPS"
  certificate_arn = aws_acm_certificate.cert.arn

  default_action {
    type             = "redirect"
    redirect {
      port = "443"
      status_code = "HTTP_301"
    }
  }
}

resource "aws_alb_listener" "listener" {
  load_balancer_arn = aws_lb.alb.arn
  port = "443"
  protocol = "HTTPS"
  certificate_arn = aws_acm_certificate.cert.arn

  default_action {
    type = "forward"
    target_group_arn = "arn:aws:elasticloadbalancing:us-east-1:598745155627:targetgroup/awards-api/2d414349089736e2"
  }
}



############
# Endpoints
############
resource "aws_vpc_endpoint" "ecr_api" {
  vpc_id       = aws_vpc.default.id
  service_name = "com.amazonaws.us-east-1.ecr.api"
  vpc_endpoint_type = "Interface"
  security_group_ids = [aws_security_group.allow_traffic.id]
}

resource "aws_vpc_endpoint" "ecr_dkr" {
  vpc_id       = aws_vpc.default.id
  service_name = "com.amazonaws.us-east-1.ecr.dkr"
  vpc_endpoint_type = "Interface"
  security_group_ids = [aws_security_group.allow_traffic.id]
}

resource "aws_vpc_endpoint" "secrets" {
  vpc_id       = aws_vpc.default.id
  service_name = "com.amazonaws.us-east-1.secretsmanager"
  vpc_endpoint_type = "Interface"
  security_group_ids = [aws_security_group.allow_traffic.id]
}

##############
# Certificate
##############
resource "aws_acm_certificate" "cert" {
  domain_name       = "*.famr.us"
  validation_method = "DNS"

  tags = {
    Environment = "production"
  }

  lifecycle {
    create_before_destroy = true
  }
}
