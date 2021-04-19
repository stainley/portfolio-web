scp "kubernetes-deploy-dev.yaml stainley@192.168.1.100:/home/stainley/Public/kubernetes"
ssh "stainley@192.168.1.100"
# shellcheck disable=SC2164
cd "/home/stainley/Public/kubernetes"
microk8s "kubectl apply -f kubernetes-deploy-dev.yaml"
