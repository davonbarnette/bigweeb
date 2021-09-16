resource "aws_ecs_task_definition" "task_definition" {
  family                = var.family_name

  container_definitions = jsonencode([
    {
      name: var.service_name,
      image     = "598745155627.dkr.ecr.us-east-1.amazonaws.com/${var.service_name}:latest"
      memory    = var.memory
      essential = true
      portMappings = [
        {
          containerPort = var.container_port
          hostPort      = var.container_port
        }
      ]
      environment = var.environment_variables
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-group = "/ecs/${var.service_name}"
          awslogs-region = "us-east-1"
          awslogs-stream-prefix = var.service_name
        }
      }
    }
  ])
  requires_compatibilities = [var.launch_type]

  network_mode = "awsvpc"
  cpu = var.cpu
  memory = var.memory

  task_role_arn = var.task_role_arn

  execution_role_arn = var.execution_role_arn

  tags = {
    Service     = var.service_name
    Environment = "production"
  }
}

resource "aws_ecs_service" "service" {
  name            = var.service_name
  cluster         = var.cluster_name
  task_definition = aws_ecs_task_definition.task_definition.arn
  desired_count   = 1
  depends_on      = [var.task_role_arn]

  platform_version = "1.3.0"

  force_new_deployment = var.force_new_deployment

  launch_type = var.launch_type

  load_balancer {
    target_group_arn = var.target_group_arn
    container_name = var.container_name
    container_port = var.container_port
  }

  network_configuration {
    subnets = var.subnets
    security_groups = [var.security_group]
    assign_public_ip = true
  }

  tags = {
    Service     = var.service_name
    Environment = "production"
  }
}