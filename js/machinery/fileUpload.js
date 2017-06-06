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


var fileUpload = (function () {
    var checkSupport = function () {
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            // Great success! All the File APIs are supported.
        } else {
            alert('The File APIs are not fully supported in this browser.');
        }
    };


    return {
        checkSupport: checkSupport
    };

}());

