import styles from "./ClassType.module.css"

export default function ClassType({name,description}){
    return (
        <div className={styles.typeContainer}>
            {/* <img src="jh"/> */}
            <h3>{name}</h3>
            <p>{description}</p>
        </div>
    )
}