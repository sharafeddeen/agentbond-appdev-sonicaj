import React from "react";
import { Container, Box, Typography } from "@mui/material";
import Image from "next/image";
import styles from "./footer.module.css";

const Footer = () => {
  return (
    <Box className={styles.footer} component="footer">
      <Container maxWidth="md" className='container'>
        <Image
          src="/images/logo_footer.png"
          alt="AgentBond"
          width={242.25}
          height={59.25}
        />
        <Typography color="gray" mt="15px" fontSize="14px">
          © 2024 AgentBond. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
