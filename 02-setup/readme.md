# Setup

1. use snap to install microk8s

- The channel specified is made up of two components; the track and the risk level.
- The track denotes the upstream Kubernetes version while the risk level reflects the maturity level of the release

```bash
sudo snap install microk8s --classic -channel=1.35/stable
```

2. Add your user to the microk8s group

```bash
sudo usermod -a -G microk8s $USER
mkdir -p ~/.kube
chmod 0700 ~/.kube
newgrp microk8s
```

- 🛑 When you install MicroK8s on an AWS EC2 instance, the entire EC2 virtual machine itself becomes the Kubernetes node.
- So if we expose any port on the EC2 instance, it will be accessible from the ec2 instance's public IP address. This is important to note when deploying applications that require external access.
