(function( GRAPHICAL, $, undefined ) {


	var scene;
	var camera;
	var renderer;
	//Array with the days that we're going to show
	var days = ["Friday, March 29", "Saturday, March 30", "Sunday, March 31",
	            "Monday, April  1", "Tuesday, April  2", "Wednesday, April  3",
	            "Thursday, April  4", "Friday, April  5"];

	//The day that is showing right now the browser
	var representingDay;
	//The retrieved data so that we don't have to retrieve each time we're showing a day
	var earthquakesData;
	//The colors of the cylinders depending on the magnitude
	var magnitudeColor = [0x0000FF, 0x00FFFF, 0x00FF00, 0xFFF000,
	                      0xFFFF00, 0xFF0000];

	/**
	 * Application Entry Point
	 * @param attachPoint the point where the element has to be attached
	 */
	GRAPHICAL.GraphApp = function(attachPoint) {
		//Create a canvas
		this.attachPoint = attachPoint;
		canvasPanel = new CanvasPanel("graphCanvas");

		//Download the data from the server
		$.ajax({url:'data/earthquakes.csv', dataType:'text'}).done(function(text) {
			handleData(CSVToArray(text));
		});
		//1. Create a renderer (sets up the system behind the scenes)
		renderer = new THREE.WebGLRenderer();
		renderer.setSize( window.innerWidth - 30, window.innerHeight - 180 );

		$(attachPoint).append(renderer.domElement); //attach it to the page
		createScene();
	};

	/**
	 * Next Day function, it is called each time the users press the next day button
	 * to show the earthquake statistics of the next day
	 */
	GRAPHICAL.NextDay = function() {
		createScene();
		representingDay += 1;
		populateWindow();
		window.requestAnimationFrame(GRAPHICAL.tick);
	};
	
	/**
	 * Previous Day function, it is called each time the users press the previous day button
	 * to show the earthquake statistics of the previous day
	 */
	GRAPHICAL.PreviousDay = function() {
		createScene();
		representingDay -= 1;
		populateWindow();
		window.requestAnimationFrame(GRAPHICAL.tick);
	};

	/**
	 * Private function that creates the scene and camera for the THREE library
	 * it is called each time we want to display the data
	 */
	function createScene() {
		//Create the stage(2D)/scene and set up cameras, lights and renderer(3D)

		// set some camera attributes
		var VIEW_ANGLE = 23, //degrees
		ASPECT = (window.innerWidth - 30) / (window.innerHeight - 180),
		NEAR = 0.5,
		FAR = 1000;

		//2. create a camera
		camera =
			new THREE.PerspectiveCamera(
					VIEW_ANGLE,
					ASPECT,
					NEAR,
					FAR);

		//3. create a scene, this is like the stage of EaselJS
		scene = new THREE.Scene();
		// Add a grid to the scene
		var plane = new THREE.Mesh( new THREE.PlaneGeometry( 400, 400, 20, 20 ), new   THREE.MeshBasicMaterial( { color: 0x000000, wireframe: true } ) );
		plane.rotation.x = - Math.PI / 2;
		scene.add(plane);
		// add the camera to the scene
		scene.add(camera);
		camera.position.x = 600;
		camera.position.y = 400;
		camera.position.z = 280;
		camera.lookAt(new THREE.Vector3( 0, -50, 0));


		//3. create a light(s)
		var light = new THREE.AmbientLight( 0x404040 ); // soft white light
		var directionalLight = new THREE.DirectionalLight( 0x404040, 0.5 );
		directionalLight.position.set( 0, 1, 0 );
		scene.add( directionalLight );
		scene.add( light );
	}

	/**
	 * Private function that is called when it retrieves the data, it just
	 * calls another function that other functions also uses
	 * @param data CSV data converted into an array
	 */
	function handleData(data) {
		earthquakesData = data;
		representingDay = parseInt(Math.random()*8);
		populateWindow();
		window.requestAnimationFrame(GRAPHICAL.tick);
	}
	
	/** Handles the retrieved data, randomly chooes a day, sets the title 
	 * of the page to the one we're going to show and checks wether the 
	 * buttons should be shown or not
	 */
	function populateWindow() {
		//sets the title to the day we're showing
		document.getElementById('titleP').innerHTML = days[representingDay];
		
		//Check if the buttons must be hidden or shown
		if (representingDay > 6)
			document.getElementById('NextDay').style.visibility='hidden';
		else
			document.getElementById('NextDay').style.visibility='visible';
		if (representingDay < 1)
			document.getElementById('PrevDay').style.visibility='hidden';
		else
			document.getElementById('PrevDay').style.visibility='visible';
		
		//Range values, from -200 to 200 in x and z
		for (var i = 1; i < earthquakesData.length - 1; i++) {
			if (earthquakesData[i][3].indexOf(days[representingDay]) != -1) {
				var mesh = new createMesh(earthquakesData[i]);
				scene.add(mesh);
			}
		}
	}

	/**
	 * This function creates the meshes with a color depending on the magnitude
	 * of the earthquake, with a cylinder geometry where the height depends on 
	 * the magnitude of the earthquake and position on the longitude and latitude 
	 * @param data just the data of the earthquake we're going to show
	 */
	function createMesh(data) {
		var meshColor = getMeshColor(data[6]);

		var material = new THREE.MeshBasicMaterial({
			color: meshColor,
			side: THREE.DoubleSide,
			depthTest: true,
			wireframe: true
		});

		var mesh = new THREE.Mesh(new THREE.CylinderGeometry(6, 6, data[6]*10, 20, 20, false), material);
		
		//X axis will be the latitude and Z axis the longitude
		//Latitude (min, max) = (-90, 90) --> *200/90
		mesh.position.x = data[4]*20/9;
		//The height will be moved so it doesb't appear "underground" (*10/2)
		mesh.position.y = data[6]*5;
		//Longitude (min, max) = (-180, 180) --> *200/180
		//Minus so it goes along with the logical axis
		mesh.position.z = -data[5]*10/9;
		return mesh;
	};
	
	/**
	 * Auxiliary function that determines which color should have the earthquake
	 * @param magnitudeValue the magnitude of the earthquake
	 */
	function getMeshColor(magnitudeValue) {
		var meshColor;
		if (magnitudeValue < 1)
			meshColor = magnitudeColor[0];
		else if (magnitudeValue < 2)
			meshColor = magnitudeColor[1];
		else if (magnitudeValue < 3)
			meshColor = magnitudeColor[2];
		else if (magnitudeValue < 4)
			meshColor = magnitudeColor[3];
		else if (magnitudeValue < 5)
			meshColor = magnitudeColor[4];
		else
			meshColor = magnitudeColor[5];

		return meshColor;
	};

	/**
	 * Animation function , called every frame
	 */
	GRAPHICAL.tick = function()	{

		//5. call render (like easelJS update)
		renderer.render(scene, camera);
		window.requestAnimationFrame(GRAPHICAL.tick);
	};


	/**
	 * An Object that moves in relation to music
	 * @param size
	 * @param position
	 * @returns
	 */
	GRAPHICAL.Note = function(size, position) {

	};
	GRAPHICAL.Note.prototype = new THREE.Mesh();
	GRAPHICAL.Note.prototype.constructor = GRAPHICAL.Note;

	/**
	* Update renderer and camera when the window is resized
	*
	* @param {Object} renderer the renderer to update
	* @param {Object} Camera the camera to update
	*/
	GRAPHICAL.WindowResize = $(window).resize(function(){
		var callback = function(){
			// notify the renderer of the size change
			renderer.setSize(window.innerWidth - 30, window.innerHeight - 180);
			// update the camera
			camera.aspect = (window.innerWidth - 30) / (window.innerHeight - 180);
			camera.updateProjectionMatrix();
		};
		// bind the resize event
		window.addEventListener('resize', callback, false);
		// return .stop() the function to stop watching window resize
		return {
			/**
			 * Stop watching window resize
			 */
			stop : function(){
				window.removeEventListener('resize', callback);
			}
		};
	});


}( window.GRAPHICAL = window.GRAPHICAL || {}, jQuery ));