import React, { useState, useEffect } from 'react'
import { Modal } from 'antd'
import styles from './menu.module.css'

export default function FoodModal({ onAccept, food, visible, onCancel }) {
    let [quantity, setQuantity] = useState(1)
    let [options, setOptions] = useState({})
    let [unitary, setUnitary] = useState(food.price)
    let [total, setTotal] = useState(food.price)

    useEffect(() => {
        getTotal()
    }, [options, quantity, food])
    useEffect(() => {
        setQuantity(1)
    }, [food])


    function placeOrder() {
        let format = {
            ...food,
            price: unitary,
            options: Object.values(options).filter(o => Boolean(o)),
            quantity,
            total
        }
        onAccept(format)
        onCancel()
    }

    function getTotal() {
        let t = Object.values(options).reduce((acc, item) => {
            if (item) return acc + item.price
            else return acc
        }, 0)
        let u = t + food.price
        let tot = u * quantity
        setUnitary(u)
        setTotal(tot)
    }

    function changeQuantity(add) {
        if (add && quantity < 50) {
            setQuantity(++quantity)

            return
        }
        if (quantity > 1) setQuantity(--quantity)
    }

    function optionClicked(item) {
        if (options[item.text]) setOptions({ ...options, [item.text]: false })
        else setOptions({ ...options, [item.text]: { ...item } })
    }

    function renderOption(item, i) {
        return (
            <div onClick={() => optionClicked(item)} key={i} className={styles.optionCard}>
                <input checked={options[item.text]} type="checkbox" />
                <span>{item.text} {item.price && `+ $ ${item.price}`}</span>
            </div>
        )
    }

    return (
        <Modal
            onCancel={onCancel}
            visible={visible}
            footer={null}
        >
            <div className={styles.modalContainer}>
                <div className={styles.modalCover}>
                    <div style={{ backgroundImage: `url('${food.pic}')` }} className={styles.modalPic} src={food.pic} />
                    <div className={styles.changes}>
                        <div className={styles.qButtons}>
                            <button
                                onClick={() => changeQuantity(false)}
                            >
                                -
                        </button>
                            <h2>{quantity}</h2>
                            <button
                                onClick={() => changeQuantity(true)}
                            >
                                +
                        </button>
                        </div>

                        <div className={styles.options}>
                            {food.options && food.options.map(renderOption)}
                        </div>
                    </div>



                </div>
                <div className={styles.modalTotal}>
                    <p>${total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}MXN</p>
                </div>
                <div className={styles.modalFooter}>
                    <button
                        onClick={onCancel}
                    >
                        CANCELAR
                    </button>
                    <button
                        onClick={placeOrder}
                        style={{ backgroundColor: "green" }}>
                        AGREGAR
                    </button>
                </div>

            </div>
        </Modal>
    )
}