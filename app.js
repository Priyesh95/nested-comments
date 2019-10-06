
// COMMENT CONTROLLER
var commentsController = (function() {
    
    var Comment = function(id, message,time,parentID) {
        this.id = id;
        this.message = message;
        // this.userName = userName;
        this.time = time;
        this.parentID = parentID
        this.child = [];
    };
    
    Comment.prototype.addChilds = function(childId) {
        this.child.push(childId);
    };

    var data = {
        comments:{
            message:[]
        }
    };

    // Fetching commentArr(if exists) from localstorage
    var getComments= function() { 
        let commentsString = localStorage.getItem("commentArr");
        if(commentsString !== null) {
            commentArr = JSON.parse(commentsString);
            commentArr.forEach(function(comment){
                var id = (comment.id); // converting to Date Object
                var message = (comment.message);	// Converting string to Int
                var time = (comment.time);
                var parentID = (comment.parentID); 
                var childs = (comment.child);
                comment  = new Comment(id,message,time,parentID)
                childs.forEach(function(child){
                    comment.addChilds(child)
                });
                data.comments.message.push(comment);  
            });
        }
        return data.comments.message
    };
    
    var generateId=function(){
    
        return 'xxxxxxxx_xxxx_4xxx_yxxx_xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      
    };

    var storeComments = function(){ 
        // Storing comments in stringified array in local storage
        localStorage.setItem('commentArr', JSON.stringify(data.comments.message));
    }
    
    return {
        getComments:function(){
            return getComments();
        },
        addComment: function(message,parentId) {
            var newComment, ID, today,time;
        
            ID = generateId().toString();
            today = new Date();
            time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            if(parentId != 0){
                newComment = new Comment(ID,message,time,parentId)
                data.comments.message.forEach(function(curr){
                    if(curr.id == parentId){
                        curr.addChilds(ID);
                    }
                });
            }
            else{
                newComment = new Comment(ID,message,time,0)
            }
            
            
            // Push it into our data structure
            data.comments.message.push(newComment);
            
            storeComments();
            // Return the new element
            return newComment;
        },  
        
        editComment: function(id,message){

            data.comments.message.forEach(function(curr){
                if(curr.id == id){
                    curr.message = message;
                    
                }
            })
            storeComments();

        },
        
        // testing: function() {
        //     console.log(data);
        // }
    };
    
})();




// UI CONTROLLER
var UIController = (function() {
    
    var DOMstrings = {
        comment_btn : ".add__comment",
        add_message: ".add__message",
        comments_list:"commentsList",
        edit_btn_class : ".edit__button",
        reply_btn_class : ".reply__button",
        edit_btn_id : "edit-",
        reply_btn_id : "reply-",
        comment_message: "message-",
        comment_id : "comment-",
        child__comment: ".add__child__comment",
        input_child_comment: "input-child-comment-",
        li_input: "input-childlist-",

    };

    var displayComment = function(comment,comments){
        let id = comment.id;
        let listElem = `
        <div class="hr"><hr/></div>
        <li id="comment-${id}" style="max-width:400px;">
        <div class="comment-handle">priyesh
        <span style="color:rgba(0,0,0,0.3);float:right">${comment.time}</span>
        </div>
        <input id="message-${id}" class="comment-message" value =${comment.message} disabled>
            
        </div>
        <button id="edit-${id}" class="edit__button edit__button1">Edit</button>
        <button id="reply-${id}" class="reply__button reply__button1">Reply</button>`;
        if(comment.child.length != 0) {
            listElem += `<ul id="childlist-${id}">`;
            comment.child.forEach(commentId=> {
                
                ids = comments.map(function(current) {
                    return current.id;
                });
    
                index = ids.indexOf(commentId);
                listElem += displayComment(commentArr[index],comments);
            });
            listElem += "</ul>";
        }		
        listElem += "</li>";
        return listElem;


    }
    
    
    
    return {
        getInput: function() {
            return {
                message: document.querySelector(DOMstrings.add_message).value,
            };
        },

        getEditInput:function(id){
            return {
                message: document.getElementById(DOMstrings.comment_message+id).value,
            };
        },

        getChildCommentInput:function(id){
            return {
                message: document.getElementById(DOMstrings.input_child_comment+id).value,
            };
        },

        removeChildCommentInput: function(id){
            var item = document.getElementById(DOMstrings.li_input+id)
            item.parentNode.removeChild(item)
        },

        displayComments: function(comments){
            var element, html, newHtml;
            element = DOMstrings.comments_list;
            let rootComments = [];
	        comments.forEach(comment=> {
		        if(comment.parentId == 0 || comment.parentID == '0') {
			        rootComments.push(comment);
		        }
	        });
            let commentList = '';
            rootComments.forEach(comment=> {
                commentList += displayComment(comment,comments);
            });
            document.getElementById(element).innerHTML = commentList;


        },
        
        addListComment: function(obj) {
            var html, newHtml, element;
            
            element = DOMstrings.comments_list;
            
            html = `<div class="hr"><hr/></div>
                    <li id="comment-%id%" style="max-width:400px;">
                    <div class="comment-handle">priyesh
                    <span style="color:rgba(0,0,0,0.3);float:right">%time%</span>
                    </div>
                    <input id="message-%messageId%" class="comment-message" value = %message% disabled>
                        
                    </div>
                    <button id="edit-%editID%" class="edit__button edit__button1">Edit</button>
                    <button id="reply-%replyID%" class="reply__button reply__button1">Reply</button>
                    </li>`;
          
            
            // Replace the placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%messageId%', obj.id);
            newHtml = newHtml.replace('%editID%', obj.id);
            newHtml = newHtml.replace('%replyID%', obj.id);
            newHtml = newHtml.replace('%message%', '"'+obj.message+'"');
            newHtml = newHtml.replace('%time%', obj.time);
            // Insert the HTML into the DOM
            document.getElementById(element).innerHTML =document.getElementById(element).innerHTML + newHtml;
        },

        addReplyInput:function(id){
            var element, html, newHtml;
            
            element = DOMstrings.comment_id;
            html = `<ul id = "input-childlist-%id%">
                    <li id="input-%inputId%">
                        <div class="add" style = "width:600px">
                            <div class="add__container">
                                <input id="input-child-comment-%iinputCommentId%" type="text" class="add__message" placeholder="Write Your Comment Here">
                                <button style = "width:130px" class="button button2 add__child__comment">Comment</button>
                            </div>
                        </div>
                    </li>
            </ul>`

            newHtml = html.replace('%id%', id);
            newHtml = newHtml.replace('%inputId%', id);
            newHtml = newHtml.replace('%iinputCommentId%', id);
            document.getElementById(element+id).insertAdjacentHTML('beforeend', newHtml);


        },
        addReplyComment:function(id,obj){
            var element, html, newHtml;
            
            element = DOMstrings.comment_id;
            html = `<ul id = "childlist-%id%">
                    <div class="hr"><hr/></div>
                    <li id="comment-%commentid%" style="max-width:400px;">
                    <div class="comment-handle">priyesh
                    <span style="color:rgba(0,0,0,0.3);float:right">%time%</span>
                    </div>
                    <input id="message-%messageId%" class="comment-message" value = %message% disabled>
                        
                    </div>
                    <button id="edit-%editID%" class="edit__button edit__button1">Edit</button>
                    <button id="reply-%replyID%" class="reply__button reply__button1">Reply</button>
                    </li>
                    </ul>`
                    ;
          
            
            // Replace the placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%commentid%', obj.id);
            newHtml = newHtml.replace('%messageId%', obj.id);
            newHtml = newHtml.replace('%editID%', obj.id);
            newHtml = newHtml.replace('%replyID%', obj.id);
            newHtml = newHtml.replace('%message%', '"'+obj.message+'"');
            newHtml = newHtml.replace('%time%', obj.time);
            document.getElementById(element+id).insertAdjacentHTML('beforeend', newHtml);

        },
        clearFields: function() {
            var fields, fieldsArr;
            
            fields = document.querySelectorAll(DOMstrings.add_message +',' + DOMstrings.input_child_comment);
            
            fieldsArr = Array.prototype.slice.call(fields);
            
            fieldsArr.forEach(function(current, index, array) {
                current.value = "";
            });
            
            fieldsArr[0].focus();
        },
        
        
        
        
        
        getDOMstrings: function() {
            return DOMstrings;
        }
    };
    
})();




// GLOBAL APP CONTROLLER
var controller = (function(cmtCtrl, UICtrl) {
    
    var setupEventListeners = function(param) {
        var DOM = UICtrl.getDOMstrings();
        if(param == 'All'){
            document.querySelector(DOM.comment_btn).addEventListener('click', ctrlAddComment);

            document.addEventListener('keypress', function(event) {
                if (event.keyCode === 13 || event.which === 13) {
                    ctrlAddComment();
                }
            });


            if(document.getElementById(DOM.comments_list).getElementsByTagName('li').length > 0){

                editElems = document.querySelectorAll(DOM.edit_btn_class)
                    editElems.forEach(function(editElem){
                    editElem.addEventListener('click', function(event){
                        commentId = event.target.id.toString();
                        splitID = commentId.split('-')
                        ID = (splitID[1]);
                        if(document.getElementById(DOM.edit_btn_id+ID).innerHTML == 'Save'){
                            ctrlEditComment(event);
                            document.getElementById(DOM.comment_message+ID).disabled = true;
                            document.getElementById(DOM.edit_btn_id+ID).innerHTML = 'Edit'
                        }
                        else{
                            document.getElementById(DOM.edit_btn_id+ID).innerHTML = 'Save'
                            document.getElementById(DOM.comment_message+ID).disabled = false;
                            
                        }
                    });
                });

                replyElems = document.querySelectorAll(DOM.reply_btn_class)
                    replyElems.forEach(function(replyElem){
                        replyElem.addEventListener('click', function(event){
                            Id = event.target.id;
                            document.getElementById(Id).disabled = true
                            ctrlReplyComment(event);
                        });
                    })
                   
                    
            }

        }
        // else if(param == 'input'){
            
        // }
        else if (param == 'child_Comment'){
            
            if(document.querySelector(DOM.child__comment)){
                var input_child_elem;
                input_child_elem = document.querySelectorAll(DOM.child__comment)
                input_child_elem.forEach(function(curr){
                    curr.addEventListener('click',function(event){
                        
                        commentId = event.target.parentNode.parentNode.parentNode.id;
                        splitID = commentId.split('-')
                        ID = (splitID[1]);
                       
                        document.getElementById(DOM.reply_btn_id+ID).disabled = false;
                        addChildComment(event)
                    })
                })
            }

        }
    
        else{

                
                editElem = document.getElementById(DOM.edit_btn_id+param)
                editElem.addEventListener('click', function(event){
                        commentId = event.target.id.toString();
                        splitID = commentId.split('-')
                        ID = (splitID[1]);
                        if(document.getElementById(DOM.edit_btn_id+ID).innerHTML == 'Save'){
                            ctrlEditComment(event);
                            document.getElementById(DOM.comment_message+ID).disabled = true;
                            document.getElementById(DOM.edit_btn_id+ID).innerHTML = 'Edit'
                        }
                        else{
                            document.getElementById(DOM.edit_btn_id+ID).innerHTML = 'Save'
                            document.getElementById(DOM.comment_message+ID).disabled = false;
                            
                        }
                    });
                    
                replyElem = document.getElementById(DOM.reply_btn_id+param)
                    replyElem.addEventListener('click', function(event){
                        console.log("event Added", DOM.reply_btn_id+param)
                        Id = event.target.id;
                        document.getElementById(Id).disabled = true
                        ctrlReplyComment(event);
                    });
                    

        }
        
        
    };
    
    var ctrlAddComment = function(){
        var input, newComment

        input = UICtrl.getInput()
        if(input.message != ''){
            
            // 1. Add Comment
            newComment = cmtCtrl.addComment(input.message,0);
            
            //2. Display Comment
            UICtrl.addListComment(newComment);

            //3. Clear fields
            UICtrl.clearFields();

            //4. Add eventlistener for edit and reply buttons
            // debugger
            setupEventListeners('All');


        }
        
    }

    var ctrlEditComment = function(event){
        var commentId;
        commentId = event.target.parentNode.id;
 
        if(commentId){
            splitID = commentId.split('-')
            ID = (splitID[1]);

            input = UICtrl.getEditInput(ID);

            cmtCtrl.editComment(ID,input.message);

        }


    }

    var ctrlReplyComment = function(event){
        console.log(event.target)
        commentId = event.target.parentNode.id;
 
        if(commentId){
            splitID = commentId.split('-');
            ID = (splitID[1]);
            UICtrl.addReplyInput(ID);
            setupEventListeners('child_Comment');

        }

    }

    var addChildComment = function(event){
    
        childCommentId = event.target.parentNode.parentNode.parentNode.id;
        splitID = childCommentId.split('-')
        ID = splitID[1];
   
        input = UICtrl.getChildCommentInput(ID)
        if(input.message != ''){
            //1. Remove input box from ui
            UICtrl.removeChildCommentInput(ID);
            
            //2. Add Comment
            newComment = cmtCtrl.addComment(input.message,ID);

            //3. Display Comment
            UICtrl.addReplyComment(ID,newComment);

            //4. Add eventlistener for edit and reply buttons
            setupEventListeners(newComment.id);
        
        }
        
    }
    
    
    
    return {
        init: function() {
            console.log('Application has started.');
            var comments = cmtCtrl.getComments();
            UICtrl.displayComments(comments);
            setupEventListeners('All');
        }
    };
    
})(commentsController, UIController);


controller.init();