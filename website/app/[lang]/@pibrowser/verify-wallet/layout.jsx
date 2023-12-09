import styles from 'app/Loading.module.css'

export default function Layout({children,params:{lang}}){
    return (
        <>
        <div className={styles.container}>
          {children}
          </div>
        </>
    );
}