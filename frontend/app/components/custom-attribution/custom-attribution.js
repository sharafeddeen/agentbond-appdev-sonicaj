import {
  Box,
  Button,
  Container,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import Image from "next/image";
import React from "react";
import styles from "./custom-attribution.module.css";
import Link from "next/link";

const CustomAttribution = () => {
  const businessTerms = [
    "How are contacts entering our HubSpot?",
    "What is causing those contacts to convert (Ex: Booking a Meeting)?",
    "Which of your channels are creating the most pipeline?",
    "Which of those channels convert to the most Closed Won Revenue?",
  ];

  const customAttributions = [
    "Creation of 25+ HubSpot Resources (Workflows, Properties, Lists, Reports)",
    "1 - 60 Minute Meeting with Senior HubSpot Architect & AgentBond (focused on Custom Attribution scoping)",
    "AI Powered Data Migration + Mapping",
    "1 - 30 Minute Review Session data mapping",
  ];

  const qualifications = [
    "B2B Business",
    "Currently using HubSpot for both Sales and Marketing",
    "Have at least 1 Professional HubSpot tier",
  ];

  return (
    <>
      <Container
        maxWidth="xl"
        sx={{ marginBottom: "6rem" }}
        className="container"
      >
        <Box
          sx={{
            textAlign: "center",
            gap: "2rem",
            marginTop: "6rem",
            marginBottom: "4rem",
          }}
        >
          <Box
            sx={{
              margin: "auto",
              marginBottom: "4rem",
            }}
            maxWidth={{
              xs: "100%",
              sm: "100%",
              md: "80%",
            }}
          >
            <Typography
              variant="h1"
              sx={{
                fontSize: {
                  xs: "2.1em",
                  sm: "2.3em",
                  md: "3em",
                },
                fontWeight: 700,
                lineHeight: 1.5,
                textAlign: "center",
                color: "white",
              }}
              className={styles.headerText}
            >
              Custom Attribution EXPRESS Setup <span>($3000 Value)</span>
            </Typography>
          </Box>
          <Typography className="body-text">
            AgentBond voouide you through the setup of our Custom Attribution
            project. This project would typically cost you thc a. of dollars and
            take 3-4 weeks. With AgentBond, you'll gain some valuable business
            and HubSpot knowledge and it will be setup in less than 60 minutes!
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              gap: "2rem",
            }}
          >
            <Box
              sx={{
                padding: "2rem 0rem",
                display: "flex",
                justifyContent: {
                  xs: "center",
                  sm: "space-between",
                  md: "space-between",
                },
                flexWrap: {
                  xs: "wrap",
                  sm: "wrap",
                  md: "nowrap",
                },
                gap: "1rem",
                width: "100%",
              }}
            >
              <Box
                sx={{
                  padding: "2rem 1rem",
                  textAlign: "start",
                  width: "100%",
                }}
                className={styles.gradientBorder}
              >
                <Typography
                  sx={{
                    fontSize: {
                      xs: "22px",
                      sm: "28px",
                    },
                    fontStyle: "normal",
                    fontWeight: 800,
                    color: "white"
                  }}
                >
                  Would you like to see, in your own business terms?
                </Typography>
                <List
                  sx={{
                    listStyleType: "disc",
                    paddingLeft: "1.8rem",
                  }}
                >
                  {businessTerms.map((term, index) => (
                    <ListItem key={index} sx={{ display: "list-item" }}>
                      <Typography className="list-text">{term}</Typography>
                    </ListItem>
                  ))}
                </List>
              </Box>
              <Box
                sx={{
                  padding: "2rem 1rem",
                  textAlign: "start",
                  width: "100%",
                }}
                className={styles.gradientBorder}
              >
                <Typography
                  sx={{
                    fontSize: {
                      xs: "22px",
                      sm: "28px",
                    },
                    fontStyle: "normal",
                    fontWeight: 800,
                    color: "white"
                  }}
                >
                  Custom Attribution Setup Includes following:
                </Typography>
                <List>
                  {customAttributions.map((term, index) => (
                    <ListItem key={index}>
                      <Typography className="list-text">{term}</Typography>
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Box>
            <Box
              sx={{
                padding: "2rem 1rem",
                textAlign: "start",
                width: "100%",
              }}
              className={styles.gradientBorder}
            >
              <Typography
                sx={{
                  fontSize: "28px",
                  fontStyle: "normal",
                  fontWeight: 800,
                  lineHeight: "160%",
                  color: "white"
                }}
              >
                PLUS:
              </Typography>
              <Typography className="list-text">
                Early Access & Discount to AgentBond public release ($3000
                Value)
              </Typography>
              <Typography className="list-text">
                1- 60 Minute Meeting with Senior HubSpot Consultant, focused on
                topic of your choice ($250 Value)
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
            marginBottom: "10rem",
          }}
        >
          <Typography sx={{ fontWeight: 600, fontSize: "24px", color: "white" }}>
            ALL of this is available FREE of charge as long as you meet the
            following qualifications:
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
            }}
            width="100%"
          >
            {qualifications.map((qualification, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Image src="/images/check.svg" width={30} height={30} />
                <Typography className="list-text">{qualification}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          zIndex: 999,
        }}
      >
        <Box className={styles.overlay}></Box>
        <Container
          maxWidth="xl"
          sx={{ marginBottom: "6rem",
            paddingTop: "6rem",
           }}
          className="container"
        >
          <Typography
            className="body-text"
            sx={{
              marginBottom: "2rem",
              textAlign: {
                xs: "start",
                sm: "start",
                md: "center",
              },
            }}
          >
            In exchange all we are asking is that you provide us with feedback
            on the process!
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "3rem",
              flexWrap: {
                xs: "wrap",
                sm: "wrap",
                md: "wrap",
                lg: "nowrap",
              },
            }}
          >
            <Box>
              <Typography
                sx={{
                  color: "#FFF",
                  fontSize: {
                    xs: "24px",
                    sm: "28px",
                    md: "32px",
                  },
                  fontStyle: "normal",
                  fontWeight: 700,
                  lineHeight: 1.6,
                }}
              >
                Your mission, if you choose to accept it, is to setup Custom
                Attribution in HubSpot with the help of AgentBond.
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: {
                    xs: "wrap",
                    lg: "wrap",
                  },
                  gap: {
                    xs: "1rem",
                    lg: "0rem",
                  },
                  marginTop: "2rem",
                }}
              >
                <Link href="https://mastertheflywheel.com/meetings/grayson29/agentbond-intro?uuid=fa7cbea3-0145-4b83-8861-5c242640d3f4" target="_blank">
                  <Button className="outlineButton" >
                    Book your 60 minute setup here
                  </Button>
                </Link>
                <Box
                  sx={{
                    display: {
                      xs: "none",
                      sm: "none",
                      md: "none",
                      lg: "block",
                    },
                  }}
                >
                  <Image
                    src="/images/left-arrow.svg"
                    width={190}
                    height={190}
                  />
                </Box>
              </Box>
            </Box>
            <Image
              src="/images/sales-consultation.png"
              width={690}
              height={570}
              className={styles.image}
            />
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default CustomAttribution;
