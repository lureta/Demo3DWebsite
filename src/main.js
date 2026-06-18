import './style.css'

/*import the three js library */

import * as THREE from 'three';

/*add orbit controls - will allow movement around the scene using the mouse*/
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

/*3d website need 3 objects
1. scene
2. camera
3. renderer */

/*scene o contain the holds all the objects, cameras, and lights */
const scene = new THREE.Scene();

/*In order to see things inside the scene we need a cmaera 

Perspective camera - mimics how people see

1st argument - field of view - amount of the world thats visible based on a full 360 degrees
2nd argument - aspect ratio - based off of the users browser window
Last two arguments are the view frustum - to control which objects are visible to the camera itself  */

const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

/*rendered to render graphics simple 
canvas with an id of background*/

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

/*now use the renderer to set the pixel ratio and full screen canvas */
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
/*move camera back for a better perseptive */
camera.position.setZ(30);

/*geometry points that makeup a shape - xyz*/
const geometry = new THREE.TorusGeometry(10,3,16,100);
/*now material - wrapping paper for an object 
many material found in three js library */
const material = new THREE.MeshStandardMaterial({color: 'purple' });
/*mesh - actual 3d object in scene*/
const torus = new THREE.Mesh(geometry, material);

scene.add(torus)

/*many kinds of lighting - start with a point light - emits lights in all directions*/
const pointLight = new THREE.PointLight(0xffffff, 100)
pointLight.position.set(2.5, 2.5, 2.5);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(pointLight, ambientLight)

/*light helper which will show the position of the point light*/
const lightHelper = new THREE.PointLightHelper(pointLight)
//scene.add(lightHelper)

/*listen to dom elements from the mouse*/
const controls = new OrbitControls(camera, renderer.domElement);

/*TIME TO MAKE SPACE*/
function addStar(){
  //make shape
  const geometry = new THREE.SphereGeometry(0.25);
  //make material
  const material = new THREE.MeshStandardMaterial({color: 0xffffff})
  //make object
  const star = new THREE.Mesh(geometry, material);

  //randomly position the stars
  //randomly generate an x y z position for each star
  //three js random float spread func
  const [x,y,z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x,y,z);
  scene.add(star)
}

//add 200 stars
Array(200).fill().forEach(addStar)

//space background
const spaceTexture = new THREE.TextureLoader().load('/src/assets/space.jpg');
scene.background = spaceTexture;

/*texture mapping - taking 2d pixels and mapping to a 3d geometry */
const profileTexture = new THREE.TextureLoader().load('/src/assets/profile.jpg');
const profile = new THREE.Mesh(
  new THREE.BoxGeometry(3,3,3),
  new THREE.MeshBasicMaterial({map: profileTexture })
);

// Add the camera to the scene so it can hold the cube
scene.add(camera);

// Attach cube to camera instead of scene
camera.add(profile);

function updateProfilePosition() {
  const distance = 25;

  const height = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2) * distance;
  const width = height * camera.aspect;

  profile.position.set(
    width / 2.6,
    height / 2.6,
    -distance
  );
}

updateProfilePosition();

//moon

const moonTexture = new THREE.TextureLoader().load('/src/assets/moon.jpg');
const normalTexture = new THREE.TextureLoader().load('/src/assets/normal.jpg');
const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3,32,32),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: normalTexture,
  })
);

scene.add(moon)

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;

  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;

  camera.position.z = 30 + t * -0.03;
  camera.position.x = t * -0.0002;
  camera.rotation.y = t * -0.0002;

}

document.body.onscroll = moveCamera;
moveCamera();


//Resizing the window 
window.addEventListener('resize', () => {
  // Update camera aspect ratio
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  // Update renderer size
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Update pixel ratio
  renderer.setPixelRatio(window.devicePixelRatio);

  updateProfilePosition();
});


/*dont want to call the render method over and over again so set up a recrusive function that
calls the render method automatically*/
function animate(){
  requestAnimationFrame(animate);

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.01;
  torus.rotation.z += 0.05;

  profile.rotation.y += -0.01;
  profile.rotation.z += -0.01;
  /*make changes update*/
  controls.update();

  renderer.render(scene, camera);
}

animate()
