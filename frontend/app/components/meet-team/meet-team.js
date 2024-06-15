import { Box, Container, Typography } from "@mui/material";
import Image from "next/image";
import React from "react";
import styles from "./meet-team.module.css";

const MeetTeamSection = () => {
  return (
    <Container
      maxWidth="xl"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginBottom: "6rem",
        paddingTop: "3rem",
      }}
      className='container'
    >
      <Box
        sx={{
          width: "80%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            marginBottom: "20px",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Image
            src="/images/grayson.svg"
            alt="grayson"
            width={170}
            height={155}
          />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "start",
            }}
          >
            <Typography
              sx={{
                fontSize: "36px",
                fontWeight: "600",
                color: "white"
              }}
            >
              Meet Grayson (a Human HubSpot Expert)
            </Typography>
            <Typography className="body-text">
              See what exactly the finished product will look like in HubSpot.
            </Typography>
          </Box>
        </Box>
        <div class={styles.videoContainer}>
          <iframe
            src="https://www.loom.com/embed/bfed783161384a4ba9b44ff7e148ba01?sid=a7fa4728-6d03-4417-8b8f-c5af92fc9587"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </Box>
    </Container>
  );
};

export default MeetTeamSection;
