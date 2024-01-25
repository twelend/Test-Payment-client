import React from 'react'
import style from './operators.module.css'
import { Link } from 'react-router-dom';


const operatorController = ({ id, name, avatar, setId}) => {

    const addToLS = () => {
        setId(id)
        localStorage.setItem('id', id)
    }

    return (
        <Link to={`/send`} style={{ textDecoration: 'none' }}>
            <div onClick={() => addToLS()} className={style.list_item}>
                <img src={avatar} alt="avatar" /><p>{name}</p>
            </div>
        </Link>
    )
}

export default operatorController