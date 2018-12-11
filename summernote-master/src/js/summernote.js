// script.
//   $(document).ready(function(){
//     $('.summernote').summernote({
//       lang:'ko-KR'
//     });
//   });
var save = require('summernote-nodejs');
var summernoteContents = '<p>Hello I am Just testing summernote-nodejs</p>';
var output = save(summernoteContents);
console.log(output);

script.
  $(document).ready(function () {
    $('#summernote').summernote();
  });