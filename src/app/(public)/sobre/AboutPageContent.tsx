'use client'

import { motion } from 'framer-motion'
import { Quote, Heart, Target, Eye, Compass } from 'lucide-react'

const timeline = [
  { year: '2018', title: 'O Início', desc: 'Mutsembeki recebe o chamado para o ministério musical e começa a compor as primeiras canções de louvor, ainda em pequenas reuniões de oração.' },
  { year: '2020', title: 'Primeiras Gravações', desc: 'Início da gravação do primeiro projecto musical, marcando o começo formal do ministério "Fé Que Move Montanhas".' },
  { year: '2022', title: 'Expansão Regional', desc: 'Participação em conferências, vigílias e eventos cristãos em várias províncias, alcançando milhares de pessoas.' },
  { year: '2024', title: 'Era Digital', desc: 'Lançamento da plataforma digital oficial, levando a mensagem do evangelho através da música a todo o mundo.' },
]

export function AboutPageContent() {
  return (
    <div className="min-h-screen pt-24">
      {/* Header */}
      <div className="bg-hero-gradient border-b border-glass-border">
        <div className="container-max px-4 md:px-8 py-16">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 text-center max-w-2xl mx-auto">
            <span className="badge">Conheça o Ministério</span>
            <h1 className="section-title">Sobre Mutsembeki</h1>
            <div className="gold-divider mx-auto" />
          </motion.div>
        </div>
      </div>

      {/* Biografia */}
      <section className="section-padding">
        <div className="container-max grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-6">
            <h2 className="font-display text-3xl font-bold text-foreground">Biografia</h2>
            <p className="text-muted-foreground leading-relaxed">
              Mutsembeki é um ministro do evangelho através da música, dedicado a levar mensagens de fé, esperança e
              transformação a todas as pessoas. A sua jornada musical começou nos corredores da igreja local, onde
              descobriu o dom de compor canções que tocam profundamente o coração.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Com uma voz marcante e letras inspiradas nas Escrituras, Mutsembeki tem dedicado a sua vida a usar a
              música como instrumento de evangelização, alcançando pessoas em momentos de dor, dúvida e busca espiritual.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="card-base space-y-4">
            <Quote className="w-10 h-10 text-gold opacity-60" />
            <p className="text-foreground text-lg italic leading-relaxed">
              &ldquo;Cada música que componho nasce de um momento de intimidade com Deus.
              Não é apenas arte — é adoração, é testemunho, é a minha forma de pregar.&rdquo;
            </p>
            <p className="text-gold font-medium">— Mutsembeki</p>
          </motion.div>
        </div>
      </section>

      {/* Missão, Visão, Chamado */}
      <section className="section-padding bg-brown/10 border-y border-glass-border">
        <div className="container-max">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Target, title: 'Missão', desc: 'Evangelizar através da música, levando a mensagem de salvação de Cristo a cada coração, em cada nação.' },
              { icon: Eye, title: 'Visão', desc: 'Ser uma voz profética que inspira gerações a buscarem a presença de Deus através do louvor e adoração.' },
              { icon: Compass, title: 'Chamado', desc: 'Servir como instrumento de transformação, usando os dons musicais para edificar o corpo de Cristo.' },
            ].map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="card-base text-center space-y-4"
              >
                <div className="w-14 h-14 rounded-2xl bg-gold-gradient mx-auto flex items-center justify-center shadow-gold-sm">
                  <Icon className="w-7 h-7 text-background" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground">{title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding">
        <div className="container-max">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center space-y-3 mb-16">
            <span className="badge">Trajectória</span>
            <h2 className="section-title">Linha do Tempo</h2>
            <div className="gold-divider mx-auto" />
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-8">
            {timeline.map((item, i) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-6"
              >
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className="w-16 h-16 rounded-2xl bg-gold-gradient flex items-center justify-center shadow-gold-sm">
                    <span className="text-background font-display font-bold">{item.year}</span>
                  </div>
                  {i < timeline.length - 1 && <div className="w-px h-full bg-gold/20 mt-3" />}
                </div>
                <div className="card-base flex-1 mb-2">
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
