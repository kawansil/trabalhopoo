    import * as readline from 'readline';

    // Interface para configurar o terminal
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    // CLASSE: Representa um lutador
    class Personagem {
        nome: string;
        vida: number = 100;
        especial: number = 0; // Barra de especial começa em 0 e vai até 100

        constructor(nome: string) {
            this.nome = nome;
        }

        // Método para atacar o oponente
        atacar(oponente: Personagem, opcaoescolhida: string) {
            let dano = 0;

            if (opcaoescolhida === '1') {
                // Ataque Rápido: Dano baixo, mas carrega bastante especial
                dano = 15;
                this.especial = Math.min(100, this.especial + 30);
                console.log(`\n⚔️ ${this.nome} usou ATAQUE RÁPIDO em ${oponente.nome} e causou ${dano} de dano!`);
            } else if (opcaoescolhida === '2') {
                // Ataque Forte: Dano médio, carrega pouco especial
                dano = 25;
                this.especial = Math.min(100, this.especial + 10);
                console.log(`\n💥 ${this.nome} usou ATAQUE FORTE em ${oponente.nome} e causou ${dano} de dano!`);
            } else if (opcaoescolhida === '3') {
                // Golpe Especial: Só funciona se a barra estiver em 100
                if (this.especial >= 100) {
                    dano = 50;
                    this.especial = 0; // Reseta a barra
                    console.log(`\n🔥 DO CHÃO NÃO PASSA! ${this.nome} soltou o GOLPE ESPECIAL em ${oponente.nome} e causou ${dano} de dano!`);
                } else {
                    console.log(`\n❌ Especial insuficiente! Você errou o golpe por falta de energia.`);
                }
            } else if (opcaoescolhida === '4') {
                console.log(`\n👋 ${this.nome} decidiu sair do jogo. Até a próxima!`);
                rl.close();
                process.exit(0);
            } else {
                console.log(`\n⚠️ Opção inválida! ${this.nome} perdeu a vez de bobeira.`);
            }

            // Aplica o dano no oponente
            oponente.vida = Math.max(0, oponente.vida - dano);
        }

        // Mostra o status atual do personagem na tela
        mostrarStatus() {

            const blocos = Math.floor(this.especial / 10);
            console.log(`${this.nome} -> Vida: ❤️ ${this.vida}/100 | ${this.especial}%`);
        }
    }

    // CLASSE: Controla o fluxo do jogo
    class Jogo {
        jogador!: Personagem;
        computador!: Personagem;

        iniciar() {
            console.log("=== BEM-VINDO AO TYPFSCRIPT FIGHTING CHAMPIONSHIP ===");
            rl.question("Escolha o nome do seu personagem: ", (nomeEscolhido: string) => {
                
                // Inicializa os lutadores
                this.jogador = new Personagem(nomeEscolhido);
                this.computador = new Personagem("Chefão");

                console.log(`\nLuta iniciada! ${this.jogador.nome} VS ${this.computador.nome}\n`);
                this.rodarTurno();
            });
        }

        rodarTurno() {
            // Exibe o status de ambos antes de escolher a ação
            this.jogador.mostrarStatus();
            this.computador.mostrarStatus();

            // Verifica se alguém morreu
            if (this.jogador.vida <= 0) {
                console.log(`\n💀 Fim de Jogo! ${this.computador.nome} venceu.`);
                rl.close();
                return;
            }
            if (this.computador.vida <= 0) {
                console.log(`\n🏆 PARABÉNS! ${this.jogador.nome} venceu a batalha!`);
                rl.close();
                return;
            }

            // Menu de escolha de golpes
            console.log(`\nSua vez! Escolha seu golpe:`);
            console.log(`1 - Ataque Rápido (Pouco dano, carrega +Especial)`);
            console.log(`2 - Ataque Forte (Dano moderado)`);
            console.log(`3 - GOLPE ESPECIAL (Requer 100% de Especial)`);
            console.log (`4 - Sair do Jogo`);

            rl.question('Escolha (1, 2, 3 ou 4): ', (opcao: string) => {
                if (opcao !== '1' && opcao !== '2' && opcao !== '3' && opcao !== '4') {
                    console.log('\n⚠️ Opção inválida! Você perdeu a vez de bobeira.');
                } else {
                    // Turno do Jogador
                    this.jogador.atacar(this.computador, opcao);
                }

                // Turno do Computador (Se ele ainda estiver vivo)
                if (this.computador.vida > 0) {
                    // IA Simples: Se tiver especial usa, senão escolhe aleatório entre 1 e 2
                    const acaoBot = this.computador.especial >= 100 ? '3' : (Math.random() > 0.5 ? '1' : '2');
                    this.computador.atacar(this.jogador, acaoBot);
                }

                console.log('\n--------------------------------------------');
                // Continua o loop do jogo chamando o próximo turno
                this.rodarTurno();
            });
        }
    }

    // Executa o jogo
    const partida = new Jogo();
    partida.iniciar();