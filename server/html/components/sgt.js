
class SGT_template{
	/* constructor - sets up sgt object 
	params: (object) elementConfig - all pre-made dom elements used by the app
	purpose: 
		- Instantiates a model and stores pre-made dom elements it this object
		- Additionally, will generate an object to store created students 
		- who exists in our content management system (CMS)
	return: undefined
	ESTIMATED TIME: 1 hour
	*/
	constructor( elementConfig ){
		this.sgtObject = {
			addButton: elementConfig.addButton,
			averageArea: elementConfig.averageArea,
			cancelButton: elementConfig.cancelButton,
			courseInput: elementConfig.courseInput,
			displayArea: elementConfig.displayArea,
			gradeInput: elementConfig.gradeInput,
			nameInput: elementConfig.nameInput
		};
		this.data = {};
		//this.storeCreatedStudents = {}; made obsolete by this.data
		this.handleAdd = this.handleAdd.bind(this);
		this.handleCancel = this.handleCancel.bind(this);
		this.handleServerData = this.handleGetServerData.bind(this);
		this.handleSendServerData = this.handleSendServerData.bind(this);
		this.handleDeleteServerData = this.handleDeleteServerData.bind(this);

		//AJAX binding
		this.getServerDataSuccess = this.getServerDataSuccess.bind(this);
		this.sendServerDataSuccess = this.sendServerDataSuccess.bind(this);
		this.deleteServerDataSuccess = this.deleteServerDataSuccess.bind(this);
		this.handleSuccessError = this.handleSuccessError.bind(this);
		this.handleServerError = this.handleServerError.bind(this);

	}
	/* addEventHandlers - add event handlers to premade dom elements
	adds click handlers to add and cancel buttons using the dom elements passed into constructor
	params: none
	return: undefined
	ESTIMATED TIME: 15 minutes
	*/

	addEventHandlers(){
		$("#addButton").on("click", this.handleAdd);
		$("#cancelButton").on("click", this.handleCancel);
		$("#serverButton").on("click", this.handleServerData);
		// return;
	}
	/* clearInputs - take the three inputs stored in our constructor and clear their values
	params: none
	return: undefined
	ESTIMATED TIME: 15 minutes
	*/
	clearInputs(){
		this.sgtObject.courseInput.val("");
		this.sgtObject.gradeInput.val("");
		this.sgtObject.nameInput.val("");
		return;	
	}
	/* handleCancel - function to handle the cancel button press
	params: none
	return: undefined
	ESTIMATED TIME: 15 minutes
	*/
	handleCancel(){
		this.clearInputs();
		return;
	}
	/* handleAdd - function to handle the add button click
	purpose: grabs values from inputs, 
	utilizes the model's add method to save them, 
	then clears the inputs and displays all students
	params: none
	return: undefined
	ESTIMATED TIME: 1 hour
	*/
	handleAdd(){
		var course = this.sgtObject.courseInput.val();
		var grade = this.sgtObject.gradeInput.val();
		var name = this.sgtObject.nameInput.val();
		this.createStudent(name, course, grade);
		//this.displayAllStudents();
		//this.clearInputs();
		this.handleSendServerData(name, course, grade);
	}
	/* displayAllStudents - iterate through all students in the model
	purpose: 
		grab all students from model, 
		iterate through the retrieved list, 
		then render every student's dom element
		then append every student to the dom's display area
		then display the grade average
	params: none
	return: undefined
	ESTIMATED TIME: 1.5 hours
	*/
	displayAllStudents(){
		$("#displayArea").empty();
		for (var studentKey in this.data){
			var studentRow = this.data[studentKey].render();
			$("#displayArea").append(studentRow);
		}
		this.displayAverage();
	}
	/* displayAverage - get the grade average and display it
	purpose: grab the average grade from the model, 
	and show it on the dom
	params: none
	return: undefined 
	ESTIMATED TIME: 15 minutes

	*/

	displayAverage(){
		var counter = 0;
		var sum = 0;
		for (var gradeKey in this.data){
			sum += this.data[gradeKey].data.grade;
			counter++;
		}
		var average = (sum/counter).toFixed(2);
		$(".avgGrade").text(average);
	}
	/* createStudent - 
	take in data for a student, 
	make a new Student object, 
	and add it to this.data object

		name : the student's name
		course : the student's course
		grade: the student's grade
		id: the id of the student
	purpose: 
			If no id is present, it must pick the next available id that can be used
			when it creates the Student object, it must pass the id, name, course, grade, 
			and a reference to SGT's deleteStudent method
	params: 
		name : the student's name
		course : the student's course
		grade: the student's grade
		id: the id of the student
	return: false if unsuccessful in adding student, true if successful
	ESTIMATED TIME: 1.5 hours
	*/
	createStudent(name, course, grade, id){
		var studentIdArray = Object.keys(this.data); 
		//this finds the keys required, makes it an array and stores student Ids
		if (this.doesStudentExist(id)){
			return false;			
		} else{
			if (id === undefined && studentIdArray.length ===0){
				id = 1;
			} else if (id === undefined && studentIdArray.length != 0){
				id = parseInt(studentIdArray[studentIdArray.length-1])+1;
			}
			if (name && course && grade && id){
			var newStudent = new Student(id, name, course, grade, this.handleDeleteServerData);
			this.data[id] = newStudent;
			return true;
			}
		}
	}
	
	/* doesStudentExist - 
		determines if a student exists by ID.  returns true if yes, false if no
	purpose: 
			check if passed in ID is a value, if it exists in this.data, and return the presence of the student
	params: 
		id: (number) the id of the student to search for
	return: false if id is undefined or that student doesn't exist, true if the student does exist
	ESTIMATED TIME: 15 minutes
	*/
	doesStudentExist(id){
		if (this.data.hasOwnProperty(id)){
			return true;
		} else {
			return false;
		}
	}
	/* readStudent - 
		get the data for one or all students
	purpose: 
			determines if ID is given or not
			if ID is given, return the student by that ID, if present
			if ID is not given, 
			return all students in an array
	params: 
		id: (number)(optional) the id of the student to search for, if any
	return: 
		a singular Student object if an ID was given, an array of Student objects if no ID was given
		ESTIMATED TIME: 45 minutes
	*/
	readStudent(id){
		var studentArray = [];
		//var studentIdArray = Object.keys(this.data);
		var studentIdArray = Object.values(this.data)
		if(id === undefined){
			/*for (var studentIndex = 0; studentIndex < studentIdArray.length; studentIndex++){
				studentArray.push(this.data[studentIdArray[studentIndex]]);
			}*/
			return studentIdArray;
		}else{
			if ( this.data[id] === undefined ){
				return false;
			}else {
				return this.data[id];
			}
		}
	}
	/* updateStudent - 
		not used for now.  Will be used later
		pass in an ID, a field to change, and a value to change the field to
	purpose: 
		finds the necessary student by the given id
		finds the given field in the student (name, course, grade)
		changes the value of the student to the given value
		for example updateStudent(2, 'name','joe') would change the name of student 2 to "joe"
	params: 
		id: (number) the id of the student to change in this.data
		field: (string) the field to change in the student
		value: (multi) the value to change the field to
	return: 
		true if it updated, false if it did not
		ESTIMATED TIME: no needed for first versions: 30 minutes
	*/
	updateStudent(id, field, value){
		//field = name || course || grade
		//value = what is in the given field
		if (this.data[id] === undefined){
			return false;
		}else{
			this.data[id].data[field] = value;
			return true;
		}
	}
	/* deleteStudent - 
		delete the given student at the given id
	purpose: 
			determine if the ID exists in this.data
			remove it from the object
			return true if successful, false if not
			this is often called by the student's delete button through the Student handleDelete
	params: 
		id: (number) the id of the student to delete
	return: 
		true if it was successful, false if not
		ESTIMATED TIME: 30 minutes
	*/
	deleteStudent(id){
		if (this.data[id] === undefined){
			return false;
		} else{
			delete this.data[id];
			return true;
		}
	}

	handleSuccessError(response){
		return console.log("These are all the server response errors", response.errors);
	}

	handleServerError(error){
		console.log(error);
		alert("Server Error!");
	}

	handleGetServerData(){
		$.ajax({
			url: "api/grades",
			method: "get",
			data: {"api_key": "ZyP2nxIC1Q"},
			dataType: "json",
			success: this.getServerDataSuccess,	
			error: this.handleServerError
		})
	}

	getServerDataSuccess (response){
		if(response.success){
			for (var studentKeys in response.data){
			this.createStudent(
			response.data[studentKeys].name, 
			response.data[studentKeys].course, 
			response.data[studentKeys].grade,
			response.data[studentKeys].id)
			}
			this.displayAllStudents();
		}else{
			this.handleSuccessError(response)
		}
		
	}

	handleSendServerData(name, course, grade){
		$.ajax({
			url: "http://s-apis.learningfuze.com/sgt/create",
			method: "post",
			data: {
				"api_key": "ZyP2nxIC1Q",
				"name": name,
				"course": course,
				"grade": grade,
			},
			timeout: 3000,
			dataType: "json",
			success: this.sendServerDataSuccess,
			error: this.handleServerError
		})
	}

	sendServerDataSuccess (response){
		if(response.success){
		console.log("It Worked!");
		this.getServerDataSuccess(response);
		this.clearInputs();
		} else{
			this.handleSuccessError(response);
		}
	}

	handleDeleteServerData(id){
		$.ajax({
			url: "http://s-apis.learningfuze.com/sgt/delete",
			method: "post",
			data: {
				"api_key": "ZyP2nxIC1Q",
				"student_id": id
			},
			dataType: "json",
			success: this.deleteServerDataSuccess,
			error: this.handleServerError
		})
	}

	deleteServerDataSuccess(response){
		if(response.success){
			console.log("deleted successfully");
		}else {
			this.handleSuccessError(response);
		}
	}



}