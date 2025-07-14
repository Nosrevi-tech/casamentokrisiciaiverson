import React from 'react';
import { Heart, Users, Sparkles } from 'lucide-react';

export default function OurStory() {
  return (
    <section id="nossa-historia" className="py-20 bg-gradient-to-br from-rose-100 to-rose-200 relative overflow-hidden">
      {/* Fundo com flores decorativas */}
      <div className="absolute inset-0 opacity-20">
        {/* Flores grandes */}
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-gradient-to-br from-rose-300 to-rose-400 blur-xl"></div>
        <div className="absolute top-20 right-20 w-24 h-24 rounded-full bg-gradient-to-br from-red-300 to-red-400 blur-lg"></div>
        <div className="absolute bottom-20 left-20 w-28 h-28 rounded-full bg-gradient-to-br from-rose-400 to-rose-500 blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-20 h-20 rounded-full bg-gradient-to-br from-red-400 to-red-500 blur-lg"></div>
        
        {/* Flores médias */}
        <div className="absolute top-1/3 left-1/4 w-16 h-16 rounded-full bg-gradient-to-br from-rose-300 to-rose-400 blur-lg"></div>
        <div className="absolute top-1/2 right-1/3 w-20 h-20 rounded-full bg-gradient-to-br from-red-300 to-red-400 blur-lg"></div>
        <div className="absolute bottom-1/3 left-1/3 w-18 h-18 rounded-full bg-gradient-to-br from-rose-400 to-rose-500 blur-lg"></div>
        <div className="absolute top-2/3 right-1/4 w-14 h-14 rounded-full bg-gradient-to-br from-red-400 to-red-500 blur-lg"></div>
        
        {/* Flores pequenas */}
        <div className="absolute top-1/4 right-1/2 w-12 h-12 rounded-full bg-gradient-to-br from-rose-300 to-rose-400 blur-md"></div>
        <div className="absolute bottom-1/4 left-1/2 w-10 h-10 rounded-full bg-gradient-to-br from-red-300 to-red-400 blur-md"></div>
        <div className="absolute top-3/4 left-1/5 w-8 h-8 rounded-full bg-gradient-to-br from-rose-400 to-rose-500 blur-md"></div>
        <div className="absolute top-1/5 right-1/5 w-6 h-6 rounded-full bg-gradient-to-br from-red-400 to-red-500 blur-md"></div>
        
        {/* Pétalas espalhadas */}
        <div className="absolute top-1/6 left-2/3 w-4 h-8 rounded-full bg-gradient-to-br from-rose-300 to-rose-400 blur-sm rotate-45"></div>
        <div className="absolute bottom-1/6 right-2/3 w-6 h-12 rounded-full bg-gradient-to-br from-red-300 to-red-400 blur-sm rotate-12"></div>
        <div className="absolute top-2/5 left-1/6 w-3 h-6 rounded-full bg-gradient-to-br from-rose-400 to-rose-500 blur-sm -rotate-30"></div>
        <div className="absolute bottom-2/5 right-1/6 w-5 h-10 rounded-full bg-gradient-to-br from-red-400 to-red-500 blur-sm rotate-60"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif text-sage-600 mb-6">Nossa História</h2>
          <p className="text-xl text-stone-600 max-w-2xl mx-auto">
            Uma jornada de amor que começou com um olhar e se transformou em uma vida juntos
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-rose-200">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="bg-primary-500 p-3 rounded-full">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-serif text-sage-600">Como nos conhecemos</h3>
                </div>
                <p className="text-stone-600 leading-relaxed">                  
                  Nos conhecemos no final de 2017, em um ensaio de dança para uma festa de 15 anos.
Ele estava largado em uma poltrona, vidrado no Clash Royale, quando ela chegou — tímida, com aquele jeitinho de quem não conhecia ninguém.

Ele lançou um olhar de canto, tentando disfarçar... mas falhou miseravelmente. Todo mundo percebeu, principalmente a Maria, que soltou logo:
"Eu vi como você olhou pra aquela compulina, os olhos até brilharam!"
E não é que ela estava certa? No fundo, ele torcia pra que ela fosse seu par na dança — e o destino colaborou.

Entre um ensaio e outro, a conversa começou a fluir. Ele, com pouco assunto, só escutava... e ela, ah, falava como ninguém. Mas ele prestava atenção em cada palavra, encantado.

Até que, num ato de coragem moderna (ou covardia clássica?), ele pediu o primeiro beijo... por WhatsApp.
Pessoalmente, o medo ainda vencia. Mas ela aceitou — e foi assim que tudo começou.

De um olhar tímido a um beijo esperado, de uma dança ensaiada a uma história real. ❤️      
                  
                </p>
              </div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-rose-200">
              <div className="flex items-center space-x-4 mb-6">
                <div className="bg-primary-500 p-3 rounded-full">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-serif text-sage-600">Nossa Trajetória</h3>
              </div>
              <p className="text-stone-600 leading-relaxed">
               Nossa história foi marcada por muitos momentos importantes, começados a partir do nosso primeiro beijo, e após algumas semanas
uma pergunta simples, mas cheia de emoção: "Você quer namorar comigo?"
E ela disse sim. E, como manda o figurino com o coração acelerado, logo depois ele foi pedir a bênção dos seus pais.
Nossa história foi se construindo em momentos únicos. Nossa primeira viagem juntos foi mais do que especial: foi nela que te entreguei o anel de namoro, símbolo do nosso compromisso e do amor que já transbordava.

Vieram outras viagens, tantos lugares novos, tantas lembranças inesquecíveis... Conhecemos as famílias um do outro, estreitamos laços, criamos raízes.

Teve diversão, teve risadas, teve até a vez em que você quebrou a mão no carrinho de bate-bate, porque sim, fui eu quem bateu. (Desculpa de novo, amor!)

Teve nosso primeiro “casamento de mentira” na quadrilha, que sem sabermos já anunciava, em tom de brincadeira, o que estava por vir.
Vieram os jantares românticos, os momentos só nossos. E também as saídas com os amigos, onde fizemos questão de nos integrar aos mundos um do outro, porque amar também é compartilhar o que temos de mais querido.

E então chegou o dia mais importante da nossa história até aqui: o nosso casamento civil. O momento em que, de mãos dadas, decidimos oficializar tudo aquilo que já era certo no coração.

Cada detalhe desses quase oito anos juntos nos fez chegar até aqui, a porta do momento mais importante de nossa história. 
              </p>
            </div>
          </div>

          <div className="text-center bg-white/90 backdrop-blur-sm rounded-2xl p-12 shadow-lg border border-rose-200">
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-r from-primary-500 to-rose-500 p-4 rounded-full">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
            </div>
            <h3 className="text-3xl font-serif text-sage-600 mb-6">O Pedido</h3>
            <p className="text-lg text-stone-600 max-w-3xl mx-auto leading-relaxed">
             A noite não estava fria, mas minhas mãos tremiam como se estivessem sentindo o inverno — era o nervosismo tomando conta de mim. Convidei ela para um jantar especial, em um lugar diferente, com o coração cheio de intenções e sonhos.

Tudo estava preparado: entreguei as alianças ao garçom e combinei com o irmão e a cunhada dela, que são incríveis com a fotografia, para registrarem cada detalhe daquele momento único.

Quando a sobremesa chegou, meu coração quase não cabia no peito. Com a voz embargada e os olhos brilhando, fiz o pedido mais sincero da minha vida. E então… ela disse ‘SIM’.

A partir dali, o tempo parou. Vieram as lágrimas, os sorrisos, os abraços. Foi um momento de puro amor, daqueles que a gente leva pra sempre na alma.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
