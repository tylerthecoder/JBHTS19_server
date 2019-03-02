cd ~/server/website/HackathonSpring2019
rm -rf node_modules
npm install
ng build
cd dist/HackathonSpring2019
sudo python -m SimpleHTTPServer 80