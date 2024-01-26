import React, { useState } from 'react'
import s from './sendForm.module.css'
import { Link } from 'react-router-dom'
import axios from 'axios';

import rub from '../../helpers/rub.svg'

const SendForm = ({ setIsError, setMessage, ballance, setBallance, getMoney, operData }) => {

    const [freshId, setFreshId] = useState(localStorage.getItem('id'))
    const [deposit, setDeposit] = useState('')
    const [phone, setPhone] = useState('')

    const [phoneError, setPhoneError] = useState('Поле обязательно для заполнения')
    const [depositError, setDepositError] = useState('Поле не может быть пустым, меньше чем 0 или больше баланса на вашей карте')
    const [phoneDirty, setPhoneDirty] = useState(false)
    const [depositDirty, setDepositDirty] = useState(false)
    const pattern = /\D/g;

    // Add mask deposit
    const onDdepositInput = (e) => {
        return e.target.value.replace(pattern, '')
    }

    const handleChangeCount = (e) => {
        let inputDepValue = onDdepositInput(e)
        setDeposit(inputDepValue)

        if (!inputDepValue) {
            setDeposit('')
            setDepositError('Поле обязательно для заполнения')
            return
        }

        const numericValue = parseInt(inputDepValue);

        if (!isNaN(numericValue) && numericValue >= 1 && numericValue <= 1000) {
            setDeposit(inputDepValue);
        } else {
            setDeposit('');
        }

        e.target.value > ballance ? setDepositError('Недостаточно средств!') : setDepositError('')
    }

    // Add mask phone
    const onPhoneInput = (e) => {
        return e.target.value.replace(pattern, '')
    }

    const handleChangePhone = (e) => {
        let inputNumbersValue = onPhoneInput(e)
        setPhone(inputNumbersValue)

        if (!inputNumbersValue) {
            setPhone('')
            setPhoneError('Поле обязательно для заполнения')
            return
        }

        if (['7', '8', '9'].indexOf(inputNumbersValue[0]) > -1) {
            if (inputNumbersValue[0] === '9') inputNumbersValue = '+' + inputNumbersValue
            let firstSymbols = (inputNumbersValue[0] === '8') ? '+7' : '+7'
            let formattedInputValue = firstSymbols + ' '
            if (inputNumbersValue.length > 1) {
                formattedInputValue += '(' + inputNumbersValue.substring(1, 4)
            }
            if (inputNumbersValue.length >= 5) {
                formattedInputValue += ') ' + inputNumbersValue.substring(4, 7)
            }
            if (inputNumbersValue.length >= 8) {
                formattedInputValue += '-' + inputNumbersValue.substring(7, 9)
            }
            if (inputNumbersValue.length >= 10) {
                formattedInputValue += '-' + inputNumbersValue.substring(9, 11)
            }
            setPhone(formattedInputValue)
        }

        let regV = /^(\s*)?(\+)?([- _():=+]?\d[- _():=+]?){11,15}(\s*)?$/;
        if (!regV.test(e.target.value)) {
            setPhoneError('Некорректный номер')
        }
        else {
            setPhoneError('')
        }
        onPhoneInput(e)

    }

    // Blur
    const blurHandler = (e) => {
        switch (e.target.name) {
            case 'phone':
                setPhoneDirty(true)
                break;
            case 'deposit':
                setDepositDirty(true)
                break
        }
    }

    // Work with data 
    function sendMoney(deposit) {
        axios.get('http://localhost:4242/replenish/', {
            params: {
                deposit
            }
        })
            .then((res) => {
                setBallance(res.data.ballance)
                getMoney()
                setMessage('Ваша операция успешно выполнена')
                setIsError(false)
            })
            .catch((error) => {
                setMessage('Ваша операция не выполнена')
                setIsError(true)
                console.warn(error)
            })
    }

    return (
        <div>
            {/* navigation */}
            <nav className={`${s.nav} ${s.section__padding}`}>
                <Link to={'/'} ><button>Back</button> </Link>
                <h1>Оплатить</h1>
            </nav>
            <div className={`${s.container} ${s.section__padding}`}>
                {/* ballance */}
                <div className={`${s.ballance} ${s.section__padding}`}>
                    <p>Баланс банковской карты:</p>
                    <span>{ballance} ₽</span>
                </div>
                <div className={`${s.operator} ${s.section__padding}`}>

                    {
                        operData[freshId - 1] ? <><img src={operData[freshId - 1].avatar} alt="avatar" /><p>{operData[freshId - 1].name}</p></> : null
                    }

                </div>
                <div className={`${s.fields} ${s.section__padding}`}>
                    <div className="number">
                        <p>Номер телефона</p>
                        {
                            (phoneDirty && phoneError) && <span className={s.error}>{phoneError}</span>
                        }
                        <input onBlur={e => blurHandler(e)} type="tel" data-tel-input name='phone' placeholder="+7 (___) ___-__" value={phone} onChange={(e) => handleChangePhone(e)} />

                    </div>
                    <hr />
                    <div className="deposit">
                        <p>Введите сумму</p>
                        {
                            (depositDirty && depositError) && <span className={s.error}>{depositError}</span>
                        }
                        <div className={s.rub}>
                            <input onBlur={e => blurHandler(e)} type="text" name='deposit' id='deposit' placeholder="0" pattern="[1-9][0-9]{0,2}" value={deposit} onChange={(e) => handleChangeCount(e)} />
                            <img id={s.ruble} src={rub} alt="₽" />
                        </div>

                    </div>
                    <hr />
                </div>
                <div className={(deposit > ballance || deposit < 1) || phone.length < 18 ? `${s.btn} ${s.section__padding} ${s.btn_disabled}` : `${s.btn} ${s.section__padding}`}>
                    <Link to={'/success'} style={{ textDecoration: 'none', color: '#000', width: '100%' }}><button disabled={(deposit > ballance || deposit < 1) || phone.length < 18} onClick={() => sendMoney(deposit)}>Оплатить</button></Link>
                </div>
            </div>
        </div>
    )
}

export default SendForm