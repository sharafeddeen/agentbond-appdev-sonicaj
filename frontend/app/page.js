import React from "react";
import { Box, Container, Typography } from "@mui/material";
import styles from "./page.module.css";
import Image from "next/image";
import LandingPageNav from "./components/landing-nav/nav";
import HeaderSection from "./components/header/header";
import CustomAttribution from "./components/custom-attribution/custom-attribution";
import MeetTeamSection from "./components/meet-team/meet-team";
import Footer from "./components/footer/footer";
import PublicDashBoard from "./components/public-bot/bot";

const App = () => {
  return (
    <div className={styles.body}>
      <LandingPageNav />
      <HeaderSection />
      <CustomAttribution />
      <Box
        sx={{
          position: "relative",
          zIndex: 999,
          overflow: "hidden",
        }}
      >
        <MeetTeamSection />
        <Box className={styles.overlay}></Box>

        <Container maxWidth="xl" className="container">
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "2rem",
              marginBottom: "4rem",
            }}
          >
            <Image src="/images/botHeadingLogo.svg" width={152} height={108} />
            <Typography
              variant="h1"
              sx={{
                fontSize: "3em",
                fontWeight: 700,
                lineHeight: 1.2,
                textAlign: "center",
                color: "white",
              }}
            >
              Any questions? Ask Bond now!
            </Typography>
          </Box>
          <PublicDashBoard />
        </Container>
      </Box>
      <Footer />
    </div>
  );
};

export default App;
