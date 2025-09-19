
# COMP.SE.140 – Docker-Compose and Microservices Hands-on
## Report for Exercise 1

### 1. Platform Information
- **Host:** VirtualBox VM running on Windows 10/11
- **Guest OS:** Ubuntu Linux (22.04 LTS or similar)
- **Docker version:** output of `docker --version`
- **Docker Compose version:** output of `docker-compose --version`

### 2. System Diagram
- **Service1** (Node.js, port 8199) forwards requests to **Service2** (PHP, port 8200)
- **Service1** also forwards to **Storage** (Node.js, port 8300)
- **Shared volume:** `./vstorage` used by all services
- **Diagram:** To be added by student if required

### 3. Analysis of Status Records
- **Service1:** uptime and free memory are measured.
- **Service2:** uptime and free disk are measured.
- Measurements are simplistic and not production-grade.
- For better accuracy: use proper monitoring libraries or system calls.

### 4. Persistent Storage Comparison
- **Volume (`./vstorage`):** Simple and fast, but considered bad design since it ties container to host filesystem.
- **Storage service (separate container):** Portable, encapsulated, and shares state across services.
- **Comparison:** Volume is good for quick testing, storage container is closer to cloud-native approach.

### 5. Cleanup Instructions
- To clear logs stored in `vstorage`: run `rm vstorage/log.txt`
- Alternatively, re-create containers with a clean volume using `docker-compose down -v`

### 6. Difficulties Faced
- Initial Docker installation and permission issues (docker group).
- Confusion between `docker-compose` vs `docker compose`.
- Clipboard and file sharing setup in VirtualBox.
- Resolved by using standalone docker-compose binary and shared folders.

### 7. Main Problems
- Learning curve for Docker networking and volumes.
- Ensuring Node.js and PHP services could communicate properly inside Docker Compose.
- Managing persistent storage so that both `vstorage` and storage container matched.
