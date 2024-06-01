'use client'

import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentDots, faBook, faBrain } from '@fortawesome/free-solid-svg-icons';

import styles from './navbar.module.css'
import { useEffect, useState } from 'react';
import BasicMenu from '../menu';
import { Button } from '@mui/material';
import User from './user/user';

import { useRouter } from 'next/navigation';
import Link from 'next/link';




const Navbar = ({ current, instance }) => {

    const [currentPage, setCurrentPage] = useState(current);

    const handleNavigation = (page) => {
        console.log(`Navigate to ${page}`)
        setCurrentPage(page)
    }

    const router = useRouter()
    const navigate = (page) => {
        if (page == 'chat') router.push('/home')
    }
    useEffect(() => {
        //navigate(currentPage)
    }, [router])



    return (
        <div className={styles.container}>

            <div className={styles.workspaceContainer}>
                <img
                    src="https://avatars.slack-edge.com/2021-11-27/2787286322689_5aaee37c9bcffea5a926_68.png"
                    className={styles.workspaceIcon}
                />
            </div>

            <div className={styles.navItemsContainer}>
                <div className={styles.navItem}>
                    <Link href='/home'>
                        <button 
                            className={ currentPage === 'chat' ? styles.navItemClickableActive : styles.navItemClickable }
                            onClick={() => handleNavigation('chat')}
                        >
                            <FontAwesomeIcon 
                                icon={faCommentDots} 
                                className={ currentPage === 'chat' ? styles.navItemIconActive : styles.navItemIcon }
                                />
                        </button>
                        <p className={styles.navItemText}>Chat</p>
                    </Link>
                </div>
                <div className={styles.navItem}>
                    <button 
                        className={ currentPage === 'docs' ? styles.navItemClickableActive : styles.navItemClickable }
                        onClick={() => handleNavigation('docs')}
                    >
                        <FontAwesomeIcon 
                            icon={faBook} 
                            className={ currentPage === 'docs' ? styles.navItemIconActive : styles.navItemIcon }
                        />
                    </button>
                    <p className={styles.navItemText}>Docs</p>
                </div>
                <div className={styles.navItem}>
                    <Link href='/context'>
                        <button 
                            className={ currentPage === 'context' ? styles.navItemClickableActive : styles.navItemClickable }
                            onClick={() => handleNavigation('context')}
                        >
                            <FontAwesomeIcon 
                                icon={faBrain} 
                                className={ currentPage === 'context' ? styles.navItemIconActive : styles.navItemIcon }
                            />
                        </button>
                        <p className={styles.navItemText}>Context</p>
                    </Link>
                </div>
            </div>


            <div className={styles.userContainer}>
                <User />
            </div>

        </div>
    )

};





export default Navbar;