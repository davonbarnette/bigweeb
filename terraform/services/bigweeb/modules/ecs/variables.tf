variable "family_name" {
  type = string
  description = "Name of ecs task definition."
}

variable "environment_variables" {
  type = list(object({name = string, value = string}))
  description = "Environment variables to be passed into the container at runtime"
}

variable "service_name" {
  type = string
  description = "Name of service ecs resources belongs to"
}

variable "cluster_name" {
  type = string
  description = "Name of cluster ecs resources belongs to"
}

variable "launch_type" {
  type = string
  description = "ECS or FARGATE"
}

variable "cpu" {
  type = number
  description = "Number of CPU units"
}

variable "memory" {
  type = number
  description = "Memory allocated for the task in MB"
}

variable "task_role_arn" {
  type = string
  description = "ARN for ecs instance to access other aws services"
}

variable "execution_role_arn" {
  type = string
  description = "ARN for ecs to access ecr"
}

variable "subnets" {
  type = list
}

variable "security_group" {
  type = string
}

variable "force_new_deployment" {
  type = bool
}

variable "target_group_arn" {
  type = string
}

variable "container_name" {
  type = string
}

variable "container_port" {
  type = number
}