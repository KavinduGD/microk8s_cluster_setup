# Add ingress to microk8s

- To enable ingress in microk8s, run the following command:

```bash
microk8s enable ingress
```

- Ingress listens on port 80 and 443, so you need to make sure that these ports are not being used by any other service on your host machine.
