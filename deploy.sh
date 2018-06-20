docker build --rm -t multichat .
docker create --name appmultichat -p 8011:8011 multichat
docker start appmultichat
