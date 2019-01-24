(function ($) {
    $(function () {
        var isUploading = false;
        
        $('#rw-form form').submit(function(e) {
            e.preventDefault();
            
            if(isUploading) return;
            
            var fd = new FormData(this);
            
            var locData = [];
            var timingData = [];
            
            $('#loading-modal').show();
            
            $.ajax({
                type: 'POST',
                url: 'https://api.getroadworthy.com/tickets/create',
                contentType: "multipart/form-data",
                data: fd,
                xhr: function() {
                    var myXhr = $.ajaxSettings.xhr();
                    if(myXhr.upload) {
                        myXhr.upload.addEventListener('progress', function(e) {
                            var max = e.total,
                                current = e.loaded,
                                pct = (current * 100)/max;

                            isUploading = true;

                            $('#loading-modal .uploading .progress-bar').width(pct + '%');

                            if(pct >= 100) {
                                console.log('done');
                                isUploading = false;
                            }
                        }, false);
                    }
                    return myXhr;
                },
                cache: false,
                processData:false,
                contentType: false
            }).success(function() {
                $('#loading-modal').hide();
                $('#loading-modal .uploading .progress-bar').width('0%');
                clearForm();
                isUploading = false;
                $('#success-modal').show();
            }).error(function(res){
                $('#loading-modal').hide();
                $('#loading-modal .uploading .progress-bar').width('0%');
                isUploading = false;
                $('#failure-modal').show();
            });
        });
        
        $('.result-modal').click(function(e) {
            if(e.target.classList.value.indexOf('result-modal') < 0 ||
               e.target.id == "loading-modal")
                return;
            
            closeModal();
        })
        
        closeModal = function() {
            $('.result-modal').hide();
        }
        
        closeAndReset = function() {
            $('.result-modal').hide();
        }
        
        clearForm = function() {
            $('input:checkbox').removeAttr('checked');
            $('input:file').val('');
            $('textarea').val('');
            $('input[name="email"]').val('');
        }
        
        $('.result-modal').on('show', function(){
            $('body').css('overflow', 'hidden');
        }).on('hidden', function(){
            $('body').css('overflow', 'auto');
        })
    })
})(jQuery);