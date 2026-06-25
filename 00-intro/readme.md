# What is Microk8s

- MicroK8s is the smallest, fastest multi-node Kubernetes. Single-package fully conformant lightweight Kubernetes that works on Linux, Windows and Mac. Perfect for: Developer workstations, IoT, Edge, CI/CD.

## Features

- Small: Developers want the smallest K8s for laptop and workstation development. MicroK8s provides a standalone K8s compatible with Azure AKS, Amazon EKS, Google GKE when you run it on Ubuntu.
- Simple: Minimize administration and operations with a single-package install that has no moving parts for simplicity and certainty. All dependencies and batteries included.
- Secure: Updates are available for all security issues and can be applied immediately or scheduled to suit your maintenance cycle.
- Current: MicroK8s tracks upstream and releases beta, RC and final bits the same day as upstream K8s. You can track the latest K8s or stick to any release version from 1.10 onwards. (Kubernetes developers release a new version, the MicroK8s developers follow it closely.)
- Comprehensive: MicroK8s includes a curated collection of manifests for common K8s capabilities and services:
  - Service Mesh: Istio, Linkerd
  - Serverless: Knative
  - Monitoring: Fluentd, Prometheus, Grafana, Metrics
  - Ingress, DNS, Dashboard, Clustering
  - Automatic updates to the latest Kubernetes version
  - GPGPU bindings for AI/ML
  - Cilium, Helm and Kubeflow!
- Can manage multiple clusters on a single machine, and can be used to create a multi-node cluster with a single command.

## k3s vs MicroK8s

- K3s is a highly portable, single-binary distribution favored for edge computing, while MicroK8s relies on Snap and is built for tight integration with the Ubuntu ecosystem (snap package)
- K3s created by Rancher Labs (Sesu), while MicroK8s is developed by Canonical, the company behind Ubuntu.
