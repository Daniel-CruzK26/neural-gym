import React from "react";
import { motion } from "framer-motion";
import "../../styles/mainMenu/gameCard.css";

const GameCard = ({ name }) => {
  return (
    <motion.div
      className="game-card"
      whileHover="hover"
      initial="rest"
      animate="rest"
    >
      <motion.div className="img-container">
        <motion.img
          src="https://picsum.photos/260/220"
          alt="Ejemplo"
          className="game-image"
          variants={{
            rest: { filter: "blur(0px) brightness(100%)" },
            hover: {
              filter: "blur(4px) brightness(80%)",
              transition: { duration: 0.3 },
            },
          }}
        />

        <motion.div
          className="texto-superpuesto"
          variants={{
            rest: { opacity: 0 },
            hover: { opacity: 1, transition: { duration: 0.4 } },
          }}
        >
          ¡Texto sobre la imagen!
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default GameCard;
