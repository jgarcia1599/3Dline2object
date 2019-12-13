function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}
 

window.addEventListener('DOMContentLoaded', function(){ 
  // get the canvas DOM element
  var canvas = document.getElementById('renderCanvas');

  // load the 3D engine
  var engine = new BABYLON.Engine(canvas, true);

  // createScene function that creates and return the scene
  var createScene = function(){
    
	// scene
	var scene = new BABYLON.Scene(engine);
	scene.clearColor = new BABYLON.Color3(0.8, 0.8, 0.8);
	var camera = new BABYLON.ArcRotateCamera("Camera", 3 *Math.PI / 2, Math.PI / 2, 20, BABYLON.Vector3.Zero(), scene);
	camera.attachControl(canvas, false);
	
	// lights
	var light = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0.3, 1, 0), scene);
	light.groundColor = new BABYLON.Color3(0.2, 0.2, 0.5);
	light.intensity = 0.6;
	var light2 = new BABYLON.PointLight("light2", new BABYLON.Vector3(-20, 0, -20), scene);
	light2.diffuse = BABYLON.Color3.White();
	light2.specular = BABYLON.Color3.Green();
	light2.intensity = 0.6;
    
  readTextFile("vectors.json", function(text){//Obtain Points and Define the offset
  var offset=5
  var offset_1=[]
  var json_points=[]
  var offset_2=[]
  var data = JSON.parse(text);
  for (var key in data['Vector3Points']) {
    if (data['Vector3Points'].hasOwnProperty(key)) {
      console.log(key + " -> " + data['Vector3Points'][key]);
      var x_coord=data['Vector3Points'][key][0]
      var y_coord=data['Vector3Points'][key][1]
      var z_coord=data['Vector3Points'][key][2]
      offset_1.push(new BABYLON.Vector3(x_coord,y_coord+offset,z_coord))
      json_points.push(new BABYLON.Vector3(x_coord,y_coord,z_coord))
      offset_2.push(new BABYLON.Vector3(x_coord,y_coord-offset,z_coord))
    }  
  }
  // material
	var mat = new BABYLON.StandardMaterial("mat1", scene);
	mat.alpha = 1.0;
	mat.backFaceCulling = false;  
  var myMaterial = new BABYLON.StandardMaterial("myMaterial", scene);
    
  var TEXTURE_PATH="https://cdn.glitch.com/1c2c7965-b669-443c-a9c8-e2c665d7babb%2FTrollFace.jpg?v=1576098311264"

  mat.diffuseTexture = new BABYLON.Texture(TEXTURE_PATH, scene);
  mat.specularTexture = new BABYLON.Texture(TEXTURE_PATH, scene);
  mat.emissiveTexture = new BABYLON.Texture(TEXTURE_PATH, scene);
  mat.ambientTexture = new BABYLON.Texture(TEXTURE_PATH, scene);
    
    
    
    
    
  var ribbon = BABYLON.MeshBuilder.CreateRibbon("ribbon", {pathArray: [offset_1, json_points, offset_2]}, scene);
	ribbon.material = mat; 
})
	return scene;
  }

  // call the createScene function
  var scene = createScene();

  // run the render loop
  engine.runRenderLoop(function(){
      scene.render();
  });

  // the canvas/window resize event handler
  window.addEventListener('resize', function(){
      engine.resize();
  });
});
