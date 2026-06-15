    import * as readline from 'readline';

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    class Personagem {
        nome: string;
        vida: number = 100;
        especial: number = 0; 

        constructor(nome: string) {
            this.nome = nome;
        }

        atacar(oponente: Personagem, opcaoescolhida: string) {
            let dano = 0;

            if (opcaoescolhida === '1') {
                dano = 15;
                this.especial = Math.min(100, this.especial + 30);
                console.log(`\n⚔️ ${this.nome} usou ATAQUE RÁPIDO em ${oponente.nome} e causou ${dano} de dano!`);
            } 
            else if (opcaoescolhida === '2') {
                dano = 25;
                this.especial = Math.min(100, this.especial + 10);
                console.log(`\n💥 ${this.nome} usou ATAQUE FORTE em ${oponente.nome} e causou ${dano} de dano!`);
            } 
            else if (opcaoescolhida === '3') {
                if (this.especial >= 100) {
                    dano = 50;
                    this.especial = 0; 
                    console.log(`\n🔥 DO CHÃO NÃO PASSA! ${this.nome} soltou o GOLPE ESPECIAL em ${oponente.nome} e causou ${dano} de dano!`);
                } 
                else {
                    console.log(`\n❌ Especial insuficiente! Você errou o golpe por falta de energia.`);
                }
            } 
            else if (opcaoescolhida === '4') {
                console.log(`\n👋 ${this.nome} decidiu sair do jogo. Até a próxima!`);
                rl.close();
                process.exit(0);
            } 
            else {
                console.log(`\n⚠️ Opção inválida! ${this.nome} perdeu a vez de bobeira.`);
            }

            oponente.vida = Math.max(0, oponente.vida - dano);
        }

        mostrarStatus() {

            const blocos = Math.floor(this.especial / 10);
            console.log(`${this.nome} -> Vida: ❤️ ${this.vida}/100 | ${this.especial}%`);
        }
    }

    class Jogo {
        jogador!: Personagem;
        computador!: Personagem;

        iniciar() {
            console.log("=== BEM-VINDO AO  FIGHTING GAME ===");
            rl.question("Escolha o nome do seu personagem: ", (nomeEscolhido: string) => {
                
                this.jogador = new Personagem(nomeEscolhido);
                this.computador = new Personagem("Chefão");

                console.log(`\nLuta iniciada! ${this.jogador.nome} VS ${this.computador.nome}\n`);
                this.rodarTurno();
            });
        }

        rodarTurno() {
            this.jogador.mostrarStatus();
            this.computador.mostrarStatus();

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

            console.log(`\nSua vez! Escolha seu golpe:`);
            console.log(`1 - Ataque Rápido (Pouco dano, carrega +Especial)`);
            console.log(`2 - Ataque Forte (Dano moderado)`);
            console.log(`3 - GOLPE ESPECIAL (Requer 100% de Especial)`);
            console.log (`4 - Sair do Jogo`);

            rl.question('Escolha (1, 2, 3 ou 4): ', (opcao: string) => {
                if (opcao !== '1' && opcao !== '2' && opcao !== '3' && opcao !== '4') {
                    console.log('\n⚠️ Opção inválida! Você perdeu a vez de bobeira.');
                } else {
                    this.jogador.atacar(this.computador, opcao);
                }

                if (this.computador.vida > 0) {
                    const acaoBot = this.computador.especial >= 100 ? '3' : (Math.random() > 0.5 ? '1' : '2');
                    this.computador.atacar(this.jogador, acaoBot);
                }

                console.log('\n--------------------------------------------');
                this.rodarTurno();
            });
        }
    }

    const partida = new Jogo();
    partida.iniciar();
