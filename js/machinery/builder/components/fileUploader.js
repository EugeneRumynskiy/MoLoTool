// $(function(){
//     $('.file_input_replacement').click(function(){
//         //This will make the element with class file_input_replacement launch the select file dialog.
//         var assocInput = $(".file_input_with_replacement");
//         console.log(assocInput);
//         assocInput.click();
//     });
//
//     $('.file_input_with_replacement').change(function(){
//         //This portion can be used to trigger actions once the file was selected or changed. In this case, if the element triggering the select file dialog is an input, it fills it with the filename
//         var thisInput = $(this);
//         var assocInput = $("#filename");
//         if (assocInput.length > 0) {
//             var filename = (thisInput.val()).replace(/^.*[\\\/]/, '');
//             assocInput.val(filename);
//         }
//     });
// });
var fileUploader = (function () {
    var _fileName = "fileUploader",
        _uploadCallback;


    var create = function (uploadCallback) {
        if (ifSupported()) {
            setUploadCallback(uploadCallback);
            setup();
        } else {
            errorHandler.logError({"fileName": _fileName, "message": "warning: file can't be loaded in this browser"});
        }
    };


    var ifSupported = function () {
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            // Great success! All the File APIs are supported.
            return true;
        } else {
            alert('The File APIs are not fully supported in this browser.');
            return false;
        }
    };


    var setUploadCallback = function (uploadCallback) {
        _uploadCallback = uploadCallback;
    };


    var uploadCallback = function (result, rewriteFlag, error) {
        _uploadCallback(result, rewriteFlag, error);
    };


    var calculateSize = function (file) {
        var nBytes = file.size,
            sOutput = nBytes + " bytes";
        // optional code for multiples approximation
        for (var aMultiples = ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"],
                 nMultiple = 0, nApprox = nBytes / 1024;
             nApprox > 1; nApprox /= 1024, nMultiple++) {
            sOutput = nApprox.toFixed(3) + " " + aMultiples[nMultiple] + " (" + nBytes + " bytes)";
        }

        console.log(sOutput, "file size.\n");
        return nBytes;
    };


    var setup = function () {
        var fileInput = document.getElementById('fileInput');

        fileInput.addEventListener('change', function(e) {
            var file = fileInput.files[0],
                //textType = /(\.txt$)|(\.fastq$)/,
                fileSize = calculateSize(file);

            console.log(file.name, "name");

            if (fileSize > 20480) {
                console.log("Error: too big file uploaded (> 20 kb).");
                uploadCallback("", false, "fileIsTooBig");
            } else {
                var reader = new FileReader();

                reader.onload = function(e) {
                    var rewriteFlag = (uiButtons.getInputMethod() === "rewrite");
                    uploadCallback(reader.result, rewriteFlag, "");
                };

                reader.readAsText(file);
            }
        });
    };


    return {
        create: create
    };
}());