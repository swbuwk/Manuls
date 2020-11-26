'use strict';
// го как создавать окна ща я чето хотел 
function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

class Game {
    constructor() {
        this.manuls = 0;
        this.super_manuls = 0;
        this.total_clicks = 0;
        this.manuls_per_click = 1;
        this.mother_power = 1;
        this.golden_manuls = 0;
        this.buying = 0;
        this.father_power=0.1
        this.grandma_power=0.0002
        this.clicks_to_gold_manul=100
        this.grandpa_hasBuff=0
        this.grandpa_buff_x=1
        this.grandpa_buff_dur=250
        

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
        this.father_power_display = document.querySelector('#father_power');
        this.super_manuls_display = document.querySelector('#super_manuls');
        this.father_progressbar = document.querySelector('#father_click_prog');
        this.father_progress_display = document.querySelector('#father_click_value');
        this.grandpa_progressbar = document.querySelector('#grandpa_click_prog');
        this.grandpa_progress_display = document.querySelector('#grandpa_click_value');
        this.grandpa_buff_display = document.querySelector('#grandpa_buff');
        this.golden_manuls_display = document.querySelector('#golden_manuls');
        this.clicks_to_gold_manul_display = document.querySelector('#clicks-to-gold-manul');

        this.special_upgrades = [
            {
                name: 'Улучшение папы манулов',
                currency: 'золотых манулов',
                hidden: false,
                desc: 'Папа манулов будет требовать на 2 клика меньше для активации эффекта',
                price: 1,
                id: 'father_gold_up',
                click_handler(game) {
                    game.father_progressbar.max = Math.max(10, game.father_progressbar.max-2);
                    game.father_progress_display.innerText = `${game.father_progressbar.value}/${game.father_progressbar.max}`
                }
            },
            {
                name: 'Улучшение добычи золотых манулов',
                currency: 'золотых манулов',
                hidden: false,
                desc: 'Теперь золотой манул будет даваться раз в 75 кликов (Можно купить 2 раза)',
                price: 3,
                price_incr: 4,
                id: 'golden_manuls_up',
                click_handler(game) {
                    if (this.price === 3) {
                        game.clicks_to_gold_manul = 75
                        this.price += this.price_incr;
                        document.querySelectorAll('.tooltip').forEach(t => t.remove())
                        this.desc='Теперь золотой манул будет даваться раз в 50 кликов (Можно купить 1 раз)'
                        game.update_counter()
                    } else {
                        game.clicks_to_gold_manul = 50
                        game.update_counter()
                        document.querySelector('#golden_manuls_up').remove()
                        document.querySelectorAll('.tooltip').forEach(t => t.remove())
                    }
                }
            },
            {
                name: 'Улучшение бабушки манулов',
                currency: 'золотых манулов',
                hidden: true,
                desc: 'Бабушка манулов будет увеличивать процент не на 0.02%, а на 0.05% (Можно купить 2 разa)',
                price: 5,
                price_incr: 10,
                id: 'grandma_golden_up',
                click_handler(game) {
                    if (this.price === 5) {
                        game.grandma_power=0.0005;
                        this.price += this.price_incr;
                        document.querySelectorAll('.tooltip').forEach(t => t.remove())
                        this.desc='Бабушка манулов будет увеличивать процент не на 0.05%, а на 0.1% (Можно купить 1 раз)'
                        game.update_counter()
                    } else {
                        game.grandma_power=0.001;
                        document.querySelector('#grandma_golden_up').remove()
                        document.querySelectorAll('.tooltip').forEach(t => t.remove())
                    }
                }
            },
        ];
        this.upgrades = [
            {
                name: '+1 манул за клик',
                currency: 'манулов',
                hidden: false,
                desc: 'ОоОоО дАаАа, ТеПеРь МаНуЛоВ зА кЛиК БуДеТ нА оДиН бОлЬшЕ',
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
                hidden: false,
                desc: 'ОоОоОо, ТеПеРь На 10 БоЛьШе!1!',
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
                desc: 'Забудьте о трате манулов ради манулов за клики, теперь это бесплатно (Можно купить 1 раз)',
                currency: 'манулов',
                hidden: false,
                id: 'mom',
                click_handler(game) {
                    const button = document.querySelector('#manuls_mother');
                    button.onclick = game.mother_click.bind(game);
                    button.classList.remove('hidden');
                    game.mother_power_display.classList.remove('hidden');
                    const upgrade_button = document.querySelector('#mom');
                    if (game.upgrades.find(el => el.id === 'dad').hidden === false) {
                    document.querySelector('#mom_power').classList.remove('hidden');
                    };
                    upgrade_button.remove();
                    document.querySelectorAll('.tooltip').forEach(t => t.remove())
                },
            },
            {
                name: '+1 к силе мамы манулов',
                price: 5000,
                desc: 'Учеличивает силу мамы манулов, чтобы мама давала больше манулов за клик',
                price_incr: 5000,
                currency: 'манулов',
                hidden: true,
                id: 'mom_power',
                click_handler(game) {
                    game.mother_power++;
                    this.price += this.price_incr;
                    game.update_counter();
                },
            },
            
            {
                name: 'Папа манулов',
                price: 1000000,
                desc: 'Тратит всех ваших манулов, однако превращает процент из них в манулов за клик (Можно купить 1 раз)',
                currency: 'манулов',
                hidden: false,
                id: 'dad',
                click_handler(game) {
                    const button = document.querySelector('.father');
                    button.onclick = game.father_click.bind(game);
                    button.classList.remove('hidden');
                    document.querySelector('#plusone').remove()
                    document.querySelector('#plusten').remove()
                    document.querySelector('#tab-selector').classList.remove('hidden');

                    document.querySelector('#dad').classList.add('hidden')
                    game.upgrades.find(el => el.id === 'dad').hidden=true

                    document.querySelector('#grandma').classList.remove('hidden');
                    game.upgrades.find(el => el.id === 'grandma').hidden=false

                    game.upgrades.find(el => el.id === 'mom_power').hidden=true
                    if (game.upgrades.find(el => el.id === 'mom_power').hidden === true) {
                        document.querySelector('#mom_power').classList.add('hidden')
                        }

                    document.querySelector('#grandpa').classList.remove('hidden');
                    game.upgrades.find(el => el.id === 'grandpa').hidden=false
                    this.total_clicks = 0;
                    document.querySelectorAll('.tooltip').forEach(t => t.remove())
                    game.update_counter();
                },
            },
            {
                name: 'Бабушка манулов',
                price: 1e25,
                desc: 'Улучшает папу манулов, повышая процент отдаваемых им манулов (Можно купить 1 раз)',
                currency: 'манулов',
                hidden: true,
                id: 'grandma',
                click_handler(game) {
                    const button = document.querySelector('#manuls_grandma');
                    button.onclick = game.grandma_click.bind(game);
                    button.classList.remove('hidden');
                    game.father_power_display.classList.remove('hidden');
                    const upgrade_button = document.querySelector('#grandma');
                    document.querySelector('#grandma_golden_up').classList.remove('hidden')

                    document.querySelector('#mom_selfpower').classList.remove('hidden')
                    game.upgrades.find(el => el.id === 'mom_selfpower').hidden=false

                    upgrade_button.remove();
                    document.querySelectorAll('.tooltip').forEach(t => t.remove())
                    game.update_counter();
                }
            },
            {
                name: 'Дедушка манулов',
                price: 1e50,
                desc: 'Улучшает всех ваших манулов на определенный множитель, зависящий от количества золотых манулов и силы мамы, эффект действует ограниченное количество кликов  (Можно купить 1 раз) "Дед внутри..."',
                currency: 'манулов',
                hidden: true,
                id: 'grandpa',
                click_handler(game) {
                    const button = document.querySelector('.granddad');
                    button.onclick = game.grandpa_click.bind(game);
                    button.classList.remove('hidden');
                    game.grandpa_buff_display.classList.remove('hidden')
                    const upgrade_button = document.querySelector('#grandpa');
                    upgrade_button.remove();
                    document.querySelectorAll('.tooltip').forEach(t => t.remove())
                    game.update_counter();
                }
            },
            {
            name: 'Самоусиление мамы',
            price: 1e60,
            desc: 'Теперь мама увеличивает свою собственную силу! (Можно купить 1 раз) "Какая сильная и независимая женщина!"',
            currency: 'манулов',
            hidden: true,
            id: 'mom_selfpower',
            click_handler(game) {
                document.querySelector('#manuls_mother').onclick = game.mother_click_new.bind(game)
                document.querySelector('#mom_selfpower').classList.add('hidden')
                game.upgrades.find(el => el.id === 'mom_selfpower').hidden=true
                game.update_counter();
                }
            },
            {
                name: 'Манулогеддон',
                price: 1e100,
                desc: '"Тсс... это секрет.."',
                currency: 'манулов',
                id: 'manulogeddon',
                click_handler(game) {
                    game.super_manuls++
                    document.querySelector('#super_manuls').classList.remove('hidden')
                    game.update_counter();
                },
            },
        ];
    }

    gold_manuls_check() {
        this.total_clicks++;
        if (this.total_clicks % this.clicks_to_gold_manul === 0) {
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
        const normalized_manuls = this.normalize_number(Math.round(this.manuls));
        const normalized_super_manuls = this.normalize_number(Math.round(this.super_manuls));
        const normalized_golden_manuls = this.normalize_number(this.golden_manuls);
        const normalized_manuls_per_click = this.normalize_number(Math.round(this.manuls_per_click));
        const normalized_mother_power = this.normalize_number(this.mother_power);
        const normalized_father_power = (100*this.father_power).toFixed(2);
        const normalized_grandpa_buff = this.normalize_number(this.grandpa_buff_x)

        if (this.grandpa_hasBuff === 1) {
            this.grandpa_buff_x=(this.golden_manuls*0.5*(1+this.mother_power*0.01)).toFixed(2);
            this.grandpa_buff_dur-=1
        }
        if (this.grandpa_buff_dur === 0) {
            this.grandpa_hasBuff=0
            this.grandpa_buff_x=1
        }

        let manuls_ending;
        let super_manuls_ending;
        let golden_manuls_ending;
        
        if (this.manuls <= 1000000000) {
            manuls_ending = this.get_ending(this.manuls, this.manuls_endings)
        } else {
            manuls_ending = this.manuls_endings.many;
        }

        if (this.super_manuls <= 1000000000) {
            super_manuls_ending = this.get_ending(this.super_manuls, this.manuls_endings)
        } else {
            super_manuls_ending = this.manuls_endings.many;
        }
        
        if (this.golden_manuls <= 1000000000) {
            golden_manuls_ending = this.get_ending(this.golden_manuls, this.golden_manuls_endings)
        } else {
            golden_manuls_ending = this.golden_manuls_endings.many;
        }
        this.manuls_display.innerHTML = `У вас ${normalized_manuls} ${manuls_ending}`;
        this.super_manuls_display.innerHTML = `У вас ${normalized_super_manuls} dead inside ${super_manuls_ending}`;
        this.manuls_per_click_display.innerHTML = `Манулов за клик: ${normalized_manuls_per_click}`;
        this.mother_power_display.innerHTML = `Сила мамы манулов: ${normalized_mother_power}`;
        this.golden_manuls_display.innerHTML =  `У вас ${normalized_golden_manuls} ${golden_manuls_ending}`;
        this.father_power_display.innerHTML = `Сила папы манулов: ${normalized_father_power}%`
        this.clicks_to_gold_manul_display.innerHTML = `1 Золотой манул = ${this.clicks_to_gold_manul} кликов`
        if (this.grandpa_hasBuff === 1) {
            this.grandpa_buff_display.innerHTML = `Множитель деда манулов: ${normalized_grandpa_buff}`
        } else {
            this.grandpa_buff_display.innerHTML = 'Множитель деда манулов: Выключен'
        }
    }

    mother_click() {
        this.gold_manuls_check();
        this.manuls_per_click += this.mother_power*this.grandpa_buff_x;
        this.update_counter();
    }

    mother_click_new() {
        this.gold_manuls_check();
        this.mother_power++
        this.update_counter();
    }

    father_click() {
        this.gold_manuls_check();
        this.father_progressbar.value++;
        if (this.father_progressbar.value === this.father_progressbar.max) { 
            this.manuls_per_click += this.father_power*this.manuls*this.grandpa_buff_x;
            this.manuls = 0;
            this.father_progressbar.value = 0;
        }
        this.father_progress_display.innerText = `${this.father_progressbar.value}/${this.father_progressbar.max}`;

        this.update_counter();
    }

    grandma_click() {
        this.father_power+=this.grandma_power*this.grandpa_buff_x
        this.gold_manuls_check();
        this.update_counter();
    }

    grandpa_click() {
        this.gold_manuls_check();
        this.grandpa_progressbar.value++;
        if (this.grandpa_hasBuff === 1) {
            this.grandpa_progressbar.value--
        }
        if (this.grandpa_progressbar.value === this.grandpa_progressbar.max) {
            this.grandpa_buff_dur=250
            this.grandpa_hasBuff=1
            this.grandpa_buff_x=this.golden_manuls*0.5*(1+this.mother_power*0.01)
            this.grandpa_progressbar.value = 0;
        }
        this.grandpa_progress_display.innerText = `${this.grandpa_progressbar.value}/${this.grandpa_progressbar.max}`;
        this.update_counter();
    }

    create_upgrade(upgrades_list, index) {
        const upgrade = upgrades_list[index];
        const li = document.createElement('li');
        const button = document.createElement('button');
        button.innerText = `${upgrade.name}
            Цена: ${this.normalize_number(upgrade.price)} ${upgrade.currency}`;
        button.classList.add('manul-button', 'click-effect');
        if (upgrade.hidden) button.classList.add('hidden');
        button.setAttribute('id', `${upgrade.id}`);

        button.onmouseover = () => {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip'
            const buttonRect = button.getBoundingClientRect()
            const x = buttonRect.x; 
            const y = buttonRect.y;
            tooltip.innerHTML = upgrade.desc
            tooltip.style.left = `${buttonRect.width + x + 2}px`
            tooltip.style.top = `${y}px`
            document.body.appendChild(tooltip);
        }

        button.onmouseout = () => {
            document.querySelectorAll('.tooltip').forEach(t => t.remove())
        }

        button.onclick = () => {

            let currency;
            switch (upgrade.currency) {
                case 'манулов':
                    currency = 'manuls';
                    break;
                case 'золотых манулов': 
                    currency = 'golden_manuls';
                    break;
                default:
                    currency = 'manuls';
                    break;
            }
            
            if (this[currency] >= upgrade.price) {
                this[currency] -= upgrade.price;
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
        li.appendChild(button); // крч думаю при лоаде добавить иф чтобы все с  dхиддаc смотри
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
            this.manuls += this.manuls_per_click*this.grandpa_buff_x;
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
