scp "kubernetes-deploy-dev.yaml stainley@192.168.1.100:/home/stainley/Public/kubernetes"
"""
  ssh -t -t stainley@192.168.1.100 -o StrictHostKeyChecking=no << EOF
  cd Public/kubernetes
  microk8s kubectl apply -f kubernetes-deploy-dev.yaml
  exit
EOF"""
