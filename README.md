# Fitness Management System — DevOps Mini Project

A starter Spring Boot REST API with Maven, MySQL, Docker Compose, Jenkins CI/CD, and local Ansible deployment.

## Features
- Create, list, retrieve, update, and delete fitness members
- Input validation for name, email, and positive weight
- REST health endpoint at `/api/health`
- MySQL persistence using Docker Compose
- Maven test/build, Docker image build, Ansible deployment, and API smoke test in Jenkins

## Requirements
- Java 21 and Maven 3.9+ for local Maven commands
- Docker Engine or Docker Desktop with WSL integration
- Ansible in WSL Ubuntu
- Jenkins running with a Linux/WSL build agent that can access `mvn`, `docker`, `docker compose`, `ansible-playbook`, and `curl`

## Run manually
From the repository root:

```bash
mvn clean verify
docker compose up -d --build
curl http://localhost:8080/api/health
curl http://localhost:8080/api/members
```

Add a member:

```bash
curl -X POST http://localhost:8080/api/members \
  -H 'Content-Type: application/json' \
  -d '{"name":"Demo Member","email":"demo@example.com","weightKg":68.5}'
```

Stop containers without deleting stored database data:

```bash
docker compose down
```

Do not use `docker compose down -v` unless you intentionally want to delete the database volume.

## Run with Ansible

```bash
ansible -i ansible/inventory.ini local -m ping
ansible-playbook -i ansible/inventory.ini ansible/deploy.yml
```

## Jenkins setup
1. Push this repository to GitHub.
2. Create a Jenkins Pipeline job and select **Pipeline script from SCM**.
3. Configure Git repository URL and branch.
4. Ensure the Jenkins agent is Linux-based and has access to Maven, Docker daemon, Docker Compose, Ansible, and curl.
5. Run the pipeline and inspect Console Output.

The sample pipeline assumes Jenkins and the local Docker deployment share the same Linux environment/daemon. A Jenkins service installed natively on Windows may not have the required `sh` shell or Docker access; use a WSL/Linux agent instead.

## API endpoints
- `GET /api/health`
- `GET /api/members`
- `GET /api/members/{id}`
- `POST /api/members`
- `PUT /api/members/{id}`
- `DELETE /api/members/{id}`

Example request body:

```json
{"name":"Demo Member","email":"demo@example.com","weightKg":68.5}
```

## Notes
- Credentials in `compose.yaml` are development-only examples. Use strong local secrets and never commit real credentials.
- This starter is an API project, not a finished React website. Authentication and workout/progress modules can be added after the CI/CD pipeline works.
