"use client"

import { motion } from "framer-motion"

import { CreateWorkspaceForm } from "./create-site-form"
import { StepHeader } from "./step-header"

export function CreateSite() {
  return (
    <motion.div
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, type: "spring" }}
    >
      <motion.div
        variants={{
          show: {
            transition: {
              staggerChildren: 0.2,
            },
          },
        }}
        initial="hidden"
        animate="show"
        className="flex flex-col space-y-4 rounded-xl bg-background/60 p-8 max-w-md"
      >
        <StepHeader
          title="Vamos começar criando seu site"
          description="Você pode atualizar o nome e a descrição mais tarde"
        />
        <motion.div
          variants={{
            hidden: { opacity: 0, x: 100 },
            show: {
              opacity: 1,
              x: 0,
              transition: { duration: 0.4, type: "spring" },
            },
          }}
        >
          <CreateWorkspaceForm />
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
