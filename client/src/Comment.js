import React from 'react'
import { 
    FiDelete, 
    FiEdit
} from 'react-icons/fi'
import { useState } from 'react'
import EditComment from './EditComment'

const  Comment = ( {c, user, handleDelete, users, id, setEditedComment, editedComment, handleUpdatedComment} ) => {

    const [isEditing, setIsEditing] = useState(false)

    const handleEditComment = (e) => {
        e.preventDefault();
        fetch(`/comments/${c.id}`, {
            method: 'PATCH',
            body: JSON.stringify({
                content: editedComment,
                user_id: user.id,
                task_id: parseInt(id)
            }), 
            headers: {
                "Content-type": "application/json"
            },
        }).then(resp => resp.json())
        .then(json => console.log(json))
        .catch(console.error);
        handleEditing()
        handleUpdatedComment(c.id)
    }

    const handleEditing = () => {
        setIsEditing((isEditing) => !isEditing)
    }
    
    return (
        <div className='comment-component'>
           
            <div className='task-comment'>
                <div className='comment-user'>
                    {users?.filter((u) => u.id === parseInt(c.user_id) ).map((u) => 
                        <div key={u.id}>
                            <div className='comment-img'>
                                <img alt='avi' src={`${u.avi}`}></img>
                            </div> 
                            <div className='comment-name'>{u.name}</div>
                            <div className='delete-btn'>{user.id === parseInt(c.user_id) ? <><FiEdit onClick={handleEditing} /><FiDelete onClick={() => handleDelete(c.id)}/></> : null}</div>
                        </div>
                    )}
                </div>
                <div className='comment-content'>{isEditing ? <EditComment handleEditComment={handleEditComment} setEditedComment={setEditedComment} c={c}/> : c.content }</div>
            </div>
            
        </div>
    )
}

export default Comment