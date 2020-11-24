'use strict';

function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

class Game {
    constructor() {
        this.manuls = 0;
        this.total_clicks = 0;
        this.manuls_per_click = 1;
        this.mother_power = 1;
        this.golden_manuls = 0;
        this.buying = 0;

        this.manuls_endings = {
            one: 'манулов',
            two: 'манула',
            many: 'манулов',
        };
        this.golden_manuls_endings = {
            one: 'золотой манул',
            two: 'золотых манула',
            many: 'золотых манулов',
        };

        this.manuls_display = document.querySelector('#manuls');
        this.golden_manuls_display = document.querySelector('#golden_manuls');
        this.manuls_per_click_display = document.querySelector('#manuls_per_click');
        this.mother_power_display = document.querySelector('#mother_power');
        this.father_progressbar = document.querySelector('#father_click_prog');
        this.father_progress_display = document.querySelector('#father_click_value');
        this.golden_manuls_display = document.querySelector('#golden_manuls')

        this.special_upgrades = [
            {
                name: 'Улучшение папы манулов',
                currency: 'золотых манулов',
                price: 1,
                id: 'golden',
                click_handler(game) {
                    game.father_progressbar.max = Math.max(10, game.father_progressbar.max-2);
                    game.father_progress_display.innerText = `${game.father_progressbar.value}/${game.father_progressbar.max}`
                }
            },
        ];
        this.upgrades = [
            {
                name: '+1 манул за клик',
                currency: 'манулов',
                price: 10,
                price_incr: 10,
                id: 'plusone',
                click_handler(game) {
                    game.manuls_per_click++;
                    this.price += this.price_incr;
                },
            },
            {
                name: '+10 манулов за клик',
                currency: 'манулов',
                price: 100,
                price_incr: 100,
                id: 'plusten',
                click_handler(game) {
                    game.manuls_per_click += 10;
                    this.price += this.price_incr;
                },
            },
            {
                name: 'Мама манулов',
                price: 100000,
                currency: 'манулов',
                id: 'mom',
                click_handler(game) {
                    const button = document.querySelector('#manuls_mother');
                    button.onclick = game.mother_click.bind(game);
                    button.classList.remove('hidden');
                    game.mother_power_display.classList.remove('hidden');
                    const upgrade_button = document.querySelector('#mom');

                    game.upgrades.push({
                        name: '+1 к силе мамы манулов',
                        price: 5000,
                        price_incr: 5000,
                        currency: 'манулов',
                        click_handler(game_) {
                            game_.mother_power++;
                            this.price += this.price_incr;
                            game_.update_counter();
                        },
                    });

                    const mother_up = game.create_upgrade(game.upgrades, game.upgrades.length - 1);
                    insertAfter(mother_up, upgrade_button);
                    upgrade_button.remove();
                },
            },
            {
                name: 'Папа манулов',
                price: 1000000,
                currency: 'манулов',
                id: 'dad',
                click_handler(game) {
                    const button = document.querySelector('.father');
                    button.onclick = game.father_click.bind(game);
                    button.classList.remove('hidden');
                    const upgrade_button = document.querySelector('#dad');
                    upgrade_button.remove();
                    document.querySelector('#tab-selector').classList.remove('hidden');
                    this.total_clicks = 0;
                },
            },
            {
                name: 'Манулогеддон',
                price: 1e100,
                currency: 'манулов',
                id: 'manulogeddon',
                click_handler(game) {
                    console.log('Теперь ты манул')
                },
            },
        ];
    }

    gold_manuls_check() {
        this.total_clicks++;
        if (this.total_clicks % 100 === 0) {
            this.golden_manuls++;
        }
    }

    normalize_number(n) {
        if (n < 1000000000) {
            return n.toLocaleString();
        } else {
            return n.toExponential(3);
        }
    }

    get_ending(n, endings) {
        if (Math.trunc((n % 100) / 10) !== 1) {
            if (n % 10 === 1) return endings.one;
            if (2 <= n % 10 && n % 10 < 5) return endings.two;
        }
        return endings.many;
    }

    update_counter() {
        const normalized_manuls = this.normalize_number(this.manuls);
        const normalized_golden_manuls = this.normalize_number(this.golden_manuls);
        const normalized_manuls_per_click = this.normalize_number(
            this.manuls_per_click,
        );
        const normalized_mother_power = this.normalize_number(this.mother_power);

        let manuls_ending;
        let golden_manuls_ending;
        
        if (this.manuls <= 1000000000) {
            manuls_ending = this.get_ending(this.manuls, this.manuls_endings)
        } else {
            manuls_ending = this.manuls_endings.many;
        }
        
        if (this.golden_manuls <= 1000000000) {
            golden_manuls_ending = this.get_ending(this.golden_manuls, this.golden_manuls_endings)
        } else {
            golden_manuls_ending = this.golden_manuls_endings.many;
        }
        this.manuls_display.innerHTML = `У вас ${normalized_manuls} ${manuls_ending}`;
        this.manuls_per_click_display.innerHTML = `Манулов за клик: ${normalized_manuls_per_click}`;
        this.mother_power_display.innerHTML = `Сила мамы манулов: ${normalized_mother_power}`;
        this.golden_manuls_display.innerHTML =  `У вас ${normalized_golden_manuls} ${golden_manuls_ending}`;
    }

    mother_click() {
        this.gold_manuls_check();
        this.manuls_per_click += this.mother_power;
        this.update_counter();
    }

    father_click() {
        this.gold_manuls_check();
        this.father_progressbar.value++;
        if (this.father_progressbar.value === this.father_progressbar.max) { 
            this.manuls_per_click += this.manuls;
            this.manuls = 0;
            this.father_progressbar.value = 0;
        }
        this.father_progress_display.innerText = `${this.father_progressbar.value}/${this.father_progressbar.max}`;

        this.update_counter();
    }

    create_upgrade(upgrades_list, index) {
        const upgrade = upgrades_list[index];
        const li = document.createElement('li');
        const button = document.createElement('button');
        button.innerText = `${upgrade.name}
            Цена: ${this.normalize_number(upgrade.price)} ${upgrade.currency}`;
        button.classList.add('manul-button', 'click-effect');
        button.setAttribute('id', `${upgrade.id}`);

        button.onclick = () => {
            if ((upgrade.currency==='манулов') & (this.manuls >= upgrade.price)) {
                this.manuls -= upgrade.price;
                this.buying = 1;
            } else {
            if ((upgrade.currency==='золотых манулов') & (this.golden_manuls >= upgrade.price)) {
                this.golden_manuls -= upgrade.price;
                this.buying = 1;
                }
            }
            if (this.buying === 1) {
                upgrade.click_handler(this);
                this.update_counter();
                button.innerText = `${upgrade.name}
                        Цена: ${upgrade.price} ${upgrade.currency}`;
                this.buying = 0;
            } else {
                button.classList.add('error')
                setTimeout(() => {
                    button.classList.remove('error')
                }, 200);
            }
        };
        li.appendChild(button);
        return li;
    }

    load() {
        const upgrades_list = document.querySelector('#upgrades-list');

        for (const i in this.upgrades) {
            const li = this.create_upgrade(this.upgrades, i);
            upgrades_list.appendChild(li);
        }

        document.querySelector('#main-button').onclick = () => {
            this.gold_manuls_check();
            this.manuls += this.manuls_per_click;
            this.update_counter();
        };

        const special_upgrades_list = document.querySelector('#special-upgrades-list');

        for (const i in this.special_upgrades) {
            const li = this.create_upgrade(this.special_upgrades, i);
            special_upgrades_list.appendChild(li);
        }

        document.querySelectorAll('.tab-select').forEach((button) => {
            button.onclick = () => {
                document.querySelectorAll('.tab').forEach((div) => {
                    if (div.id == button.name) {
                        div.classList.remove('hidden');
                    } else {
                        div.classList.add('hidden');
                    }
                });
            };
        });

        this.update_counter();
    }
}

const mygame = new Game();

window.onload = () => {
    mygame.load();
};
