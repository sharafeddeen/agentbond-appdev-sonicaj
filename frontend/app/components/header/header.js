"use client";

import { Box, Button, Container, Typography } from "@mui/material";
import Image from "next/image";
import React from "react";
import styles from "./header.module.css";
import { useRouter } from "next/navigation";

const HeaderSection = () => {
  const router = useRouter();

  const handleSignUp = () => {
    router.push("/register");
  };

  return (
    <Box
      sx={{
        position: "relative",
      }}
    >
      <Box className={styles.overlay}></Box>
      <Container
        maxWidth="xl"
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          gap: "1.5rem",
          paddingTop: "12rem",
          paddingBottom: "8rem",
          position: "relative",
        }}
        className="container"
      >
        <Typography
          variant="h2"
          sx={{
            color: "white",
            fontSize: {
              xs: "2.2em",
              sm: "2.5em",
              md: "3em",
            },
            fontWeight: 700,
            lineHeight: {
              xs: 1.5,
              sm: 1.4,
              md: 1.2,
            },
          }}
        >
          The AI Evolution of HubSpot Services
        </Typography>
        <Typography className="body-text">
          We have an exciting announcement, keep reading for details!
        </Typography>
        <Box
          sx={{
            padding: "6rem 0rem",
            display: "flex",
            justifyContent: {
              xs: "center",
              sm: "space-between",
              md: "space-between",
            },
            alignItems: {
              xs: "center",
              sm: "space-between",
              md: "space-between",
            },
            flexWrap: "wrap",
            gap: {
              xs: "4rem",
              sm: "3rem",
              md: "2rem",
            },
            width: {
              xs: "100%",
              sm: "80%",
              md: "70%",
            },
          }}
        >
          <Image
            src="/images/SonaMation.svg"
            width={231}
            height={136}
            alt="SonaMation"
            className={styles.blendMode}
          />
          <Image
            src="/images/HubSpot_Solutions_Partner.svg"
            width={160}
            height={160}
            alt="HubSpot_Solutions_Partner"
          />
          <Image
            src="/images/logo_header.svg"
            width={306}
            height={75}
            alt="logo_header"
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Typography
            width={{
              xs: "100%",
              sm: "75%",
              md: "65%",
            }}
            className="body-text"
          >
            Today we are announcing a new team member. His name is Bond…
            <b>AgentBond!</b> Bond is our new AI employee. You can meet him
            below!
          </Typography>
          <Image
            src="/images/hubspot_team.png"
            width={1000}
            height={650}
            className={styles.image}
            alt="logo"
          />
          <Typography className="body-text" width="75%">
            AgentBond is already being used internally with our clients. How
            would you like to try it? We're offering $6000 in FREE HubSpot
            Services to our first 30 Beta Testers.
          </Typography>
        </Box>
        <Button
          variant="outlined"
          size="lg"
          className={styles.button}
          onClick={handleSignUp}
        >
          Sign Up Now
        </Button>
      </Container>
    </Box>
  );
};

export default HeaderSection;
