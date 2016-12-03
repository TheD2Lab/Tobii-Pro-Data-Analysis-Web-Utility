<?php
$target_dir = "uploads/";
$target_file = $target_dir . basename($_FILES["file"]["name"]);
$uploadOk = 1;
$fileType = pathinfo($target_file,PATHINFO_EXTENSION);

if ($_FILES["fileToUpload"]["size"] > 10000000) { // 10 MB
	echo "Sorry, your file is too large.";
	$uploadOk = 0;
}

if ($fileType != "tsv") {
	echo "Sorry, only TSV file uploads are allowed.";
	$uploadOk = 0;
}

if ($uploadOk == 0) {
	echo "Sorry, your file was not uploaded";
}
else {
	if (move_uploaded_file($_FILES["file"]["tmp_name"], $target_file)) {
		$response = array();
		exec("java -jar tobii_analysis.jar " . $_FILES["file"]["name"] . " " . $_REQUEST["stats"] , $response);
		echo current($response);
	}
	else {
		echo "Sorry, there was an error uploading the file.";
	}
}
?>