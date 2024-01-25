import React, { useState } from 'react'
import style from './operators.module.css'
import OC from './operatorController'

const Operators = ({ setId, operData, isLoaded }) => {
    const [open, setOpen] = useState(false)

    return (
        <div className={style.list_container}>
            <h1>Для пополнения баланса, выберете своего мобильного оператора:</h1>
            {
                !isLoaded ? <div className={style.loading}>Загрузка...</div> :
                    <div className={open ? `${style.list} ${style.list_open}`: style.list}>
                        {
                            !open ? operData.slice(0, 6).map((item, key) => <OC key={key} id={item.id} name={item.name} avatar={item.avatar} setId={setId} />) :
                                operData.map((item, key) => <OC key={key} id={item.id} name={item.name} avatar={item.avatar} setId={setId} />)
                        }
                    </div>
            }
            <div className={style.btn_container}>
                <button className={style.button} onClick={() => setOpen(!open)}> {open ? "Hide" : "Show"} </button>
            </div>
        </div>
    )
}

export default Operators