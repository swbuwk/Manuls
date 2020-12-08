'use strict';

function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function toBase64(text) {
    return btoa(text);
}

function fromBase64(text) {
    return atob(text);
}

class Game {
    constructor() {
        this.manuls = 0;
        this.super_manuls = 0;
        this.total_clicks = 0;
        this.manuls_per_click = 1;
        this.mother_power = 1;
        this.golden_manuls = 0;
        this.father_power = 0.1;
        this.grandma_power = 0.0002;
        this.clicks_to_gold_manul = 100;
        this.grandpa_hasBuff = 0;
        this.grandpa_buff_x = 1;
        this.grandpa_buff_dur = 250;
        this.music_playing = true

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

        this.save_slot = 'manuls-save';
        this.main_buttons_visibility = [
            { id: 'main-button', hidden: false },
            { id: 'manuls_mother', hidden: true },
            { id: 'father', hidden: true },
            { id: 'manuls_grandma', hidden: true },
            { id: 'granddad', hidden: true },
        ];

        this.text_visibility = [
            { id: 'super_manuls', hidden: true },
            { id: 'manuls', hidden: false },
            { id: 'manuls_per_click', hidden: false },
            { id: 'mother_power', hidden: true },
            { id: 'father_power', hidden: true },
            { id: 'grandpa_buff', hidden: true },
        ];

        this.special_upgrades = [
            {
                name: 'Улучшение папы манулов',
                currency: 'золотых манулов',
                hidden: false,
                desc: 'Папа манулов будет требовать на 2 клика меньше для активации эффекта',
                price: 1,
                id: 'father_gold_up',
                click_handler(game) {
                    game.father_progressbar.max = Math.max(10, game.father_progressbar.max - 2);
                    game.father_progress_display.innerText = `${game.father_progressbar.value}/${game.father_progressbar.max}`;
                },
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
                        game.clicks_to_gold_manul = 75;
                        this.price += this.price_incr;
                        game.hide_tooltip();
                        this.desc =
                            'Теперь золотой манул будет даваться раз в 50 кликов (Можно купить 1 раз)';
                        game.update_counter();
                    } else {
                        game.clicks_to_gold_manul = 50;
                        game.update_counter();
                        game.toggle_hide('golden_manuls_up', true);
                        game.hide_tooltip();
                    }
                },
            },
            {
                name: 'Улучшение бабушки манулов',
                currency: 'золотых манулов',
                hidden: true,
                desc:
                    'Бабушка манулов будет увеличивать процент не на 0.02%, а на 0.05% (Можно купить 2 разa)',
                price: 5,
                price_incr: 10,
                id: 'grandma_golden_up',
                click_handler(game) {
                    if (this.price === 5) {
                        game.grandma_power = 0.0005;
                        this.price += this.price_incr;
                        game.hide_tooltip();
                        this.desc =
                            'Бабушка манулов будет увеличивать процент не на 0.05%, а на 0.1% (Можно купить 1 раз)';
                        game.update_counter();
                    } else {
                        game.grandma_power = 0.001;
                        game.toggle_hide('grandma_golden_up', true);
                        game.hide_tooltip();
                    }
                },
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
                desc:
                    'Забудьте о трате манулов ради манулов за клики, теперь это бесплатно (Можно купить 1 раз)',
                currency: 'манулов',
                hidden: false,
                id: 'mom',
                click_handler(game) {
                    game.toggle_hide(document.querySelector('#manuls_mother'), false);
                    game.toggle_hide(game.mother_power_display, false);
                    game.toggle_hide('mom_power', false);

                    const upgrade_button = document.querySelector('#mom');
                    if (game.upgrades.find(up => up.id === 'dad').hidden) {
                        game.toggle_hide('mom_power', true);
                    }
                    console.log(upgrade_button);
                    game.toggle_hide(upgrade_button, true);
                    game.hide_tooltip();
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
                desc:
                    'Тратит всех ваших манулов, однако превращает процент из них в манулов за клик (Можно купить 1 раз)',
                currency: 'манулов',
                hidden: false,
                id: 'dad',
                click_handler(game) {
                    game.toggle_hide(document.querySelector('#father'), false);

                    game.toggle_hide('plusone', true);
                    game.toggle_hide('plusten', true);

                    game.toggle_hide('mom_power', true);

                    game.toggle_hide('dad', true);

                    game.toggle_hide('grandma', false);
                    game.toggle_hide('grandpa', false);

                    this.total_clicks = 0;
                    game.hide_tooltip();
                    game.update_counter();
                    document.querySelector('#special-upgrades').classList.remove('hidden');
                },
            },
            {
                name: 'Бабушка манулов',
                price: 1e25,
                desc:
                    'Улучшает папу манулов, повышая процент отдаваемых им манулов (Можно купить 1 раз)',
                currency: 'манулов',
                hidden: true,
                id: 'grandma',
                click_handler(game) {
                    game.toggle_hide(document.querySelector('#manuls_grandma'), false);

                    game.toggle_hide(game.father_power_display, false);

                    const upgrade_button = document.querySelector('#grandma');
                    game.toggle_hide('grandma_golden_up', false);

                    game.toggle_hide('mom_selfpower', false);

                    game.toggle_hide(upgrade_button, true);
                    game.hide_tooltip();
                    game.update_counter();
                },
            },
            {
                name: 'Дедушка манулов',
                price: 1e50,
                desc:
                    'Улучшает всех ваших манулов на определенный множитель, зависящий от количества золотых манулов и силы мамы, эффект действует ограниченное количество кликов  (Можно купить 1 раз) "Дед внутри..."',
                currency: 'манулов',
                hidden: true,
                id: 'grandpa',
                click_handler(game) {
                    game.toggle_hide(document.querySelector('#granddad'), false);

                    game.toggle_hide(game.grandpa_buff_display, false);

                    const upgrade_button = document.querySelector('#grandpa');
                    game.toggle_hide(upgrade_button, true);
                    game.hide_tooltip();
                    game.update_counter();
                },
            },
            {
                name: 'Самоусиление мамы',
                price: 1e60,
                desc:
                    'Теперь мама увеличивает свою собственную силу! (Можно купить 1 раз) "Какая сильная и независимая женщина!"',
                currency: 'манулов',
                hidden: true,
                id: 'mom_selfpower',
                click_handler(game) {
                    game.toggle_hide('mom_selfpower', true);
                    document.querySelector('#manuls_mother').onclick = game.mother_click_new.bind(game);
                    game.update_counter();
                },
            },
            {
                name: 'Манулогеддон',
                price: 1e100,
                desc: '"Тсс... это секрет.."',
                currency: 'манулов',
                hidden: false,
                id: 'manulogeddon',
                click_handler(game) {
                    game.super_manuls++;
                    game.toggle_hide('super_manuls', false);
                    game.update_counter();
                    document.getElementById("manulogeddon-audio").play();
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

    toggle_hide(id_or_obj, state) {
        console.log(id_or_obj);
        switch (typeof id_or_obj) {
            case 'string':
                const up =
                    this.upgrades.find(el => el.id === id_or_obj) ||
                    this.special_upgrades.find(el => el.id === id_or_obj) ||
                    this.main_buttons_visibility.find(el => el.id === id_or_obj) ||
                    this.text_visibility.find(el => el.id === id_or_obj);
                
                

                if (up) {
                    up.hidden = state;
                    if (state) {
                        document.querySelector(`#${id_or_obj}`).classList.add('hidden');
                    } else {
                        document.querySelector(`#${id_or_obj}`).classList.remove('hidden');
                    }
                }
                break;
            case 'object':
                const id = id_or_obj.id;

                const upgrade =
                    this.upgrades.find(el => el.id === id) ||
                    this.special_upgrades.find(el => el.id === id) ||
                    this.main_buttons_visibility.find(el => el.id === id) ||
                    this.text_visibility.find(el => el.id === id);

                console.log(upgrade);

                if (state) {
                    id_or_obj.classList.add('hidden');
                    upgrade.hidden = state;
                } else {
                    id_or_obj.classList.remove('hidden');
                    upgrade.hidden = state;
                }
                break;
        }
    }

    hide_tooltip() {
        document.querySelectorAll('.tooltip').forEach(t => t.remove());
    }

    update_counter() {
        const normalized_manuls = this.normalize_number(Math.round(this.manuls));
        const normalized_super_manuls = this.normalize_number(Math.round(this.super_manuls));
        const normalized_golden_manuls = this.normalize_number(this.golden_manuls);
        const normalized_manuls_per_click = this.normalize_number(
            Math.round(this.manuls_per_click)
        );
        const normalized_mother_power = this.normalize_number(this.mother_power);
        const normalized_father_power = (100 * this.father_power).toFixed(2);
        const normalized_grandpa_buff = this.normalize_number(this.grandpa_buff_x);

        if (this.grandpa_hasBuff === 1) {
            this.grandpa_buff_x = (
                this.golden_manuls *
                0.5 *
                (1 + this.mother_power * 0.01)
            ).toFixed(2);
            this.grandpa_buff_dur -= 1;
        }
        if (this.grandpa_buff_dur === 0) {
            this.grandpa_hasBuff = 0;
            this.grandpa_buff_x = 1;
        }

        let manuls_ending;
        let super_manuls_ending;
        let golden_manuls_ending;

        if (this.manuls <= 1000000000) {
            manuls_ending = this.get_ending(this.manuls, this.manuls_endings);
        } else {
            manuls_ending = this.manuls_endings.many;
        }

        if (this.super_manuls <= 1000000000) {
            super_manuls_ending = this.get_ending(this.super_manuls, this.manuls_endings);
        } else {
            super_manuls_ending = this.manuls_endings.many;
        }

        if (this.golden_manuls <= 1000000000) {
            golden_manuls_ending = this.get_ending(this.golden_manuls, this.golden_manuls_endings);
        } else {
            golden_manuls_ending = this.golden_manuls_endings.many;
        }
        this.manuls_display.innerHTML = `У вас ${normalized_manuls} ${manuls_ending}`;
        this.super_manuls_display.innerHTML = `У вас ${normalized_super_manuls} dead inside ${super_manuls_ending}`;
        this.manuls_per_click_display.innerHTML = `Манулов за клик: ${normalized_manuls_per_click}`;
        this.mother_power_display.innerHTML = `Сила мамы манулов: ${normalized_mother_power}`;
        this.golden_manuls_display.innerHTML = `У вас ${normalized_golden_manuls} ${golden_manuls_ending}`;
        this.father_power_display.innerHTML = `Сила папы манулов: ${normalized_father_power}%`;
        this.clicks_to_gold_manul_display.innerHTML = `1 Золотой манул = ${this.clicks_to_gold_manul} кликов`;
        if (this.grandpa_hasBuff === 1) {
            this.grandpa_buff_display.innerHTML = `Множитель деда манулов: ${normalized_grandpa_buff}`;
        } else {
            this.grandpa_buff_display.innerHTML = 'Множитель деда манулов: Выключен';
        }
    }

    mother_click() {
        this.gold_manuls_check();
        this.manuls_per_click += this.mother_power * this.grandpa_buff_x;
        this.update_counter();
    }

    mother_click_new() {
        this.gold_manuls_check();
        this.mother_power++;
        this.update_counter();
    }

    father_click() {
        this.gold_manuls_check();
        this.father_progressbar.value++;
        if (this.father_progressbar.value === this.father_progressbar.max) {
            this.manuls_per_click += this.father_power * this.manuls * this.grandpa_buff_x;
            this.manuls = 0;
            this.father_progressbar.value = 0;
        }
        this.father_progress_display.innerText = `${this.father_progressbar.value}/${this.father_progressbar.max}`;

        this.update_counter();
    }

    grandma_click() {
        this.father_power += this.grandma_power * this.grandpa_buff_x;
        this.gold_manuls_check();
        this.update_counter();
    }

    grandpa_click() {
        this.gold_manuls_check();
        this.grandpa_progressbar.value++;
        if (this.grandpa_hasBuff === 1) {
            this.grandpa_progressbar.value--;
        }
        if (this.grandpa_progressbar.value === this.grandpa_progressbar.max) {
            this.grandpa_buff_dur = 250;
            this.grandpa_hasBuff = 1;
            this.grandpa_buff_x = this.golden_manuls * 0.5 * (1 + this.mother_power * 0.01);
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
        button.setAttribute('id', `${upgrade.id}`);

        if (upgrade.hidden) {
            this.toggle_hide(button, true);
        }

        button.onmouseover = () => {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            const buttonRect = button.getBoundingClientRect();
            const { x, y, width } = buttonRect;
            tooltip.innerHTML = upgrade.desc;
            tooltip.style.left = `${width + x + 2}px`;
            tooltip.style.top = `${y}px`;
            document.body.appendChild(tooltip);
        };

        button.onmouseout = () => {
            this.hide_tooltip();
        };

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
            } else {
                button.classList.add('error');
                setTimeout(() => {
                    button.classList.remove('error');
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
            this.manuls += this.manuls_per_click * this.grandpa_buff_x;
            this.update_counter();
        };

        const special_upgrades_list = document.querySelector('#special-upgrades-list');

        for (const i in this.special_upgrades) {
            const li = this.create_upgrade(this.special_upgrades, i);
            special_upgrades_list.appendChild(li);
        }

        document.querySelectorAll('.tab-select').forEach(button => {
            button.onclick = () => {
                document.querySelectorAll('.tab').forEach(div => {
                    if (div.id === button.name) {
                        div.classList.remove('hidden');
                    } else {
                        div.classList.add('hidden');
                    }
                });
            };
        });

        document.querySelector('#manuls_mother').onclick = this.mother_click.bind(this);
        document.querySelector('#father').onclick = this.father_click.bind(this);
        document.querySelector('#manuls_grandma').onclick = this.grandma_click.bind(this);
        document.querySelector('#granddad').onclick = this.grandpa_click.bind(this);

        if (localStorage.getItem(this.save_slot) !== null) {
            this.loadSave();
        }

        this.update_counter();

        document.querySelector('#music-button').onclick = () => {
            const audio = document.getElementById("bg-audio");
            if (this.music_playing) {
                audio.pause();
                this.music_playing = false
            } else {
                audio.play();
                this.music_playing = true
            }
        };

        document.querySelector('#save-button').onclick = () => {
            this.save();
        };

        document.querySelector('#load-save-button').onclick = () => {
            const data = prompt('Введите код сохранения:');
            this.loadSave(data);
        };

        document.querySelector('#get-save-button').onclick = () => {
            prompt('Код вашего сохранения:', this.save(false));
        };

        document.querySelector('#delete-save-button').onclick = () => {
            if (
                confirm('Вы собираетесь удалить свое сохранение, подтвердить?') &&
                confirm('Вы уверены? Прогресс в игре полностью потеряется!')
            ) {
                localStorage.removeItem(this.save_slot);
                location.reload();
            }
        };
        

        setInterval(() => {
            this.save();
        }, 1000 * 60);
    }

    update_upgrades() {
        this.upgrades
            .concat(this.special_upgrades)
            .concat(this.main_buttons_visibility)
            .concat(this.text_visibility)
            .forEach(upgrade => {
                upgrade.hidden
                    ? document.querySelector(`#${upgrade.id}`).classList.add('hidden')
                    : document.querySelector(`#${upgrade.id}`).classList.remove('hidden');
            });

        if (!this.main_buttons_visibility.find(el => el.id === 'father').hidden) {
            document.querySelector('#special-upgrades').classList.remove('hidden');
        }
    }

    save(should_write = true) {
        const data = JSON.stringify(this, (key, val) => {
            return Array.isArray(val)
                ? JSON.stringify(val.map(el => el.hidden))
                : !key || typeof val === 'number' || typeof val === 'boolean' 
                ? val
                : undefined;
        });

        const encoded = toBase64(data);

        if (should_write) {
            localStorage.setItem(this.save_slot, encoded);
        }

        return encoded;
    }

    loadSave(save) {
        save = save || localStorage.getItem(this.save_slot);
        try {
            const decoded = fromBase64(save);
            const data = JSON.parse(decoded, (key, val) => {
                if (typeof val === 'string') {
                    return JSON.parse(val).map((is_hidden, i) => {
                        this[key][i].hidden = is_hidden;
                        return this[key][i];
                    });
                }
                return val;
            });

            console.log('LOADED DATA:', data);
            Object.assign(this, data);
            this.update_counter();
            this.update_upgrades();
        } catch (e) {
            alert('Ошибка при загрузке сохранения.');
            console.error(e);
        }
    }
}

const mygame = new Game();

function autoPlay() {
    // DOMException: play() failed because the user didn't interact with the document first. https://goo.gl/xX8pDD
    const audio = document.getElementById("bg-audio");
    audio.src = 'click.mp3';
    audio.volume = 0.25;
    audio.loop = true;
    // акрч смотри я хочу чтобы сохранлось в сейве music_playing тру или фолс типа чтобы она отключалась у тех кто ее отрубил 
    if (mygame.music_playing) {
        audio.play();
    }

    document.removeEventListener('click', autoPlay);
}

window.onload = () => {

    document.addEventListener('click', autoPlay);

    
    mygame.load(); // 698 строка 😈😈😈😈😈😈😈😈 я сука
};

// СЛЕДУЮЩЕЕ ЧТО БУДЕМ ДЕЛАТЬ КАК ПОКУШАЮ, ДОБАВИМ BigInt!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1!!!!