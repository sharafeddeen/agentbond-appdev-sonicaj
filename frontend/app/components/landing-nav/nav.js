"use client";

import Image from "next/image";
import React from "react";
import styles from "./nav.module.css";
import { Box, Button } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";

const LandingPageNav = () => {
  const router = useRouter();

  const handleSignUp = () => {
    router.push("/register");
  };

  return (
    <Box
      className={styles.navContainer}
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <Link href="/">
        <Box
          sx={{
            display: {
              xs: "none",
              sm: "block",
            },
          }}
        >
          <Image src="/images/logo_footer.png" width={242} height={60} />
        </Box>
        <Box
          sx={{
            display: {
              xs: "block",
              sm: "none",
            },
          }}
        >
          <Image src="/images/logo-nav-mobile.png" width={60} height={60} />
        </Box>
      </Link>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "2rem",
        }}
      >
        <Link href="/login">Login</Link>
        <Button className="outlineButton" onClick={handleSignUp}>
          Join Us!
        </Button>
      </Box>
    </Box>
  );
};

export default LandingPageNav;
