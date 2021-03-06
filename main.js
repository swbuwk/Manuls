'use strict';

BigInt.prototype.toJSON = function () {
    return this.toString(16); // 16-ричная все
}; // такс из бигинта делается строка........ спс крч

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
        this.manuls = 0n;
        this.super_manuls = 0n;
        this.mega_manuls = 0n;
        this.total_clicks = 0;
        this.manuls_per_click = 1n;
        this.mother_power = 1n;
        this.golden_manuls = 0n;
        this.father_power = 1000n;
        this.grandma_power = 1n;
        this.clicks_to_gold_manul = 100;
        this.grandpa_hasBuff = false;
        this.grandpa_buff_x = 1n;
        this.grandpa_buff_dur = 250;
        this.music_playing = true;
        this.father_progress_max = 100;
        this.super_manuls_buff = 1n;
        this.notifications = 0;
        this.ascend_count = 0;
        this.mother_power_itself= false;

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

        this.achievements = [
            {
                title: 'Мой первый манул',
                desc: 'Получите своего первого манула',
                id: 'my_first_manul',
                achieved: false,
                check(game) {
                    return game.manuls >= 1n;
                },
            },
            {
                title: 'Мой второй манул',
                desc: 'Получите своего второго манула!',
                id: 'my_second_manul',
                achieved: false,
                check(game) {
                    return game.manuls >= 2n;
                },
            },
            {
                title: 'Манулград',
                desc: 'Получите 500000 манулов',
                id: 'manulgrad',
                achieved: false,
                check(game) {
                    return game.manuls >= 500000n;
                },
            },
            {
                title: 'Манулы > Люди',
                desc: 'Получите манулов больше, чем людей на Земле',
                id: 'manuls_bigger_peoples',
                achieved: false,
                check(game) {
                    return game.manuls >= 7000000000n;
                },
            },
            {
                title: 'Манулы > Вселенная',
                desc: 'Получите манулов больше, чем атомов во Вселенной!',
                id: 'manuls_bigger_universe',
                achieved: false,
                check(game) {
                    return game.manuls >= 10n ** 80n;
                },
            },
            {
                title: 'Первое пополнение',
                desc: 'Купите маму манулов',
                id: 'buy_manul_mother',
                achieved: false,
                check(game) {
                    return !game.main_buttons_visibility.find(b => b.id === 'manuls_mother').hidden;
                },
            },
            {
                title: 'Ушедший за молоком',
                desc: 'Купите папу манулов',
                id: 'buy_manul_father',
                achieved: false,
                check(game) {
                    return !game.main_buttons_visibility.find(b => b.id === 'father').hidden;
                },
            },
            {
                title: 'Следующее поколение',
                desc: 'Купите бабушку манулов',
                id: 'buy_manul_grandma',
                achieved: false,
                check(game) {
                    return !game.main_buttons_visibility.find(b => b.id === 'manuls_grandma').hidden;
                },
            },
            {
                title: 'Полная семья',
                desc: 'Купите всех манулов',
                id: 'buy_all_manuls',
                achieved: false,
                check(game) {
                    return (!game.main_buttons_visibility.find(b => b.id === 'granddad').hidden &
                    !game.main_buttons_visibility.find(b => b.id === 'manuls_grandma').hidden &
                    !game.main_buttons_visibility.find(b => b.id === 'father').hidden &
                    !game.main_buttons_visibility.find(b => b.id === 'manuls_mother').hidden
                    )
                },
            },
            {
                title: 'Мам??',
                desc: 'Купите папу манулов до того, как купите маму манулов',
                id: 'buy_manul_father_before_mother',
                achieved: false,
                check(game) {
                    return false
                },
            },
            {
                title: 'Конец?',
                desc: 'Купите Манулогеддон',
                id: 'buy_manulogeddon',
                achieved: false,
                check(game) {
                    return game.super_manuls>=1
                },
            },
            {
                title: 'Бесполезность',
                desc: 'Купите Манулирование вселенной',
                id: 'buy_manulir',
                achieved: false,
                check(game) {
                    return game.mega_manuls>=1
                },
            },
            {
                title: 'Добрый папа',
                desc: 'Улучшите папу до минимума кликов (10 кликов за конвертацию)',
                id: 'good_dad',
                achieved: false,
                check(game) {
                    return game.father_progress_max === 10
                },
            },
            {
                title: 'Великий гладильщик манулов',
                desc: 'Кликните на манулов 10000 раз',
                id: 'cliks_ach',
                achieved: false,
                check(game) {
                    return game.total_clicks>=10000
                },
            },
            {
                title: 'Сильная и независимая женщина',
                desc: 'Улучшите силу мамы манулов до 1000000',
                id: 'mom_pover_ach',
                achieved: false,
                check(game) {
                    return game.mother_power>=1000000n
                },
            },
        ];

        this.unearned_achieves_list = this.achievements.map(ach => ach.id);
        this.earned_achieves_list = []

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

        // prompt
        this.prompt = document.querySelector('#prompt');
        this.prompt_title = document.querySelector('#prompt-title');
        this.prompt_confirm = document.querySelector('#prompt_confirm');
        this.save_text_area = document.querySelector('#save_text_area');
        this.prompt_bg = document.querySelector('#prompt_bg');

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
                price: 1n,
                id: 'father_gold_up',
                click_handler(game) {
                    game.father_progress_max = Math.max(10, game.father_progress_max - 2);
                    game.father_progress_display.innerText = `${game.father_progressbar.value}/${game.father_progress_max}`;
                },
            },
            {
                name: 'Улучшение добычи золотых манулов',
                currency: 'золотых манулов',
                hidden: false,
                desc: 'Теперь золотой манул будет даваться раз в 75 кликов (Можно купить 3 раза)',
                price: 3n,
                price_incr: 4n,
                id: 'golden_manuls_up',
                click_handler(game) {
                    if (this.price === 3n) {
                        game.clicks_to_gold_manul = 75;
                        this.price += this.price_incr;
                        game.hide_tooltip();
                        this.desc =
                            'Теперь золотой манул будет даваться раз в 50 кликов (Можно купить 2 раза)';
                        game.update_counter();
                    } else if (this.price === 7n) {
                        this.price = 20n;
                        game.clicks_to_gold_manul = 50;
                        game.update_counter();
                        game.hide_tooltip();
                        this.desc =
                            'Теперь золотой манул будет даваться раз в 25 кликов!!! (Можно купить 1 раз)';
                    } else {
                        game.toggle_hide('golden_manuls_up', true);
                        game.clicks_to_gold_manul = 25;
                        game.update_counter();
                        game.hide_tooltip();
                    }
                },
            },
            {
                name: 'Улучшение бабушки манулов',
                currency: 'золотых манулов',
                hidden: true,
                desc:
                    'Бабушка манулов будет увеличивать процент не на 0.01%, а на 0.1% (Можно купить 2 разa)',
                price: 5n,
                price_incr: 10n,
                id: 'grandma_golden_up',
                click_handler(game) {
                    if (this.price === 5n) {
                        game.grandma_power = 10n;
                        this.price += this.price_incr;
                        game.hide_tooltip();
                        this.desc =
                            'Бабушка манулов будет увеличивать процент не на 0.1%, а на 0.25% (Можно купить 1 раз)';
                        game.update_counter();
                    } else {
                        game.grandma_power = 25n;
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
                price: 10n,
                price_incr: 10n,
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
                price: 100n,
                price_incr: 100n,
                id: 'plusten',
                click_handler(game) {
                    game.manuls_per_click += 10n;
                    this.price += this.price_incr;
                },
            },
            {
                name: 'Мама манулов',
                price: 100000n,
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
                    game.toggle_hide(upgrade_button, true);
                    game.hide_tooltip();
                },
            },
            {
                name: '+1 к силе мамы манулов',
                price: 5000n,
                desc: 'Учеличивает силу мамы манулов, чтобы мама давала больше манулов за клик',
                price_incr: 5000n,
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
                price: 1000000n,
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

                    if (game.main_buttons_visibility.find(b => b.id === 'manuls_mother').hidden) {
                        game.earn_achievement('buy_manul_father_before_mother')
                    }
                    this.total_clicks = 0;
                    game.hide_tooltip();
                    game.update_counter();
                    document.querySelector('#special-upgrades').classList.remove('hidden');
                },
            },
            {
                name: 'Бабушка манулов',
                price: 10n ** 20n,
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
                price: 10n ** 50n,
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
                price: 10n ** 60n,
                desc:
                    'Теперь мама увеличивает свою собственную силу! (Можно купить 1 раз) "Какая сильная и независимая женщина!"',
                currency: 'манулов',
                hidden: true,
                id: 'mom_selfpower',
                click_handler(game) {
                    game.toggle_hide('mom_selfpower', true);
                    document.querySelector('#manuls_mother').onclick = game.mother_click_new.bind(
                        game
                    );
                    game.mother_power_itself = true
                    game.update_counter();
                },
            },
            {
                name: 'Манулогеддон',
                price: 10n ** 100n,
                desc: '"Тсс... это секрет.."',
                currency: 'манулов',
                hidden: false,
                id: 'manulogeddon',
                click_handler(game) {
                    this.desc =
                        'Генерируют супер манулов, которые баффают всех остальных манулов в сотни раз!';
                    this.price = this.price * 10n ** 10n;
                    game.super_manuls += 1n;
                    game.super_manuls_buff = game.super_manuls * 100n;
                    game.toggle_hide('manul_end', false);
                    game.toggle_hide('super_manuls', false);
                    game.update_counter();
                },
            },
            {
                name: 'Манулирование вселенной',
                price: 10n ** 1000n,
                desc: '"Настоящий секрет..."',
                currency: 'манулов',
                hidden: true,
                id: 'manul_end',
                click_handler(game) {
                    game.ascend_count++;
                    game.mega_manuls++;
                    document.querySelector('#god-upgrades').classList.remove('hidden');
                    document.querySelector('#main-button').classList.remove('manul-big-button');
                    document.querySelector('#main-button').classList.add('manul-big-button-new');
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
        if (n < 1000000000n) {
            return n.toLocaleString();
        } else if (n > 1.79e308) {
            return `${n.toString()[0]}.${n.toString().slice(1, 3)}e${n.toString().slice(1).length}`;
        } else {
            return Number(n.toString()).toExponential(3);
        }
    }

    get_ending(n, endings) {
        // тут можно и перевести его в намбер
        n = Number(n);
        if (Math.trunc((n % 100) / 10) !== 1) {
            if (n % 10 === 1) return endings.one;
            if (2 <= n % 10 && n % 10 < 5) return endings.two;
        }
        return endings.many;
    }

    toggle_hide(id_or_obj, state) {
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
        const normalized_manuls = this.normalize_number(this.manuls);
        const normalized_super_manuls = this.normalize_number(this.super_manuls);
        const normalized_golden_manuls = this.normalize_number(this.golden_manuls);
        const normalized_manuls_per_click = this.normalize_number(this.manuls_per_click);
        const normalized_mother_power = this.normalize_number(this.mother_power);
        const normalized_grandpa_buff = this.normalize_number(this.grandpa_buff_x);

        if (this.grandpa_hasBuff) {
            this.grandpa_buff_x = (this.golden_manuls * (1n + this.mother_power / 1000n)) / 2n;
            this.grandpa_buff_dur -= 1;
        }
        if (!this.grandpa_buff_dur) {
            this.grandpa_hasBuff = false;
            this.grandpa_buff_x = 1n;
        }

        let manuls_ending;
        let super_manuls_ending;
        let golden_manuls_ending;

        if (this.manuls <= 10n ** 9n) {
            manuls_ending = this.get_ending(this.manuls, this.manuls_endings);
        } else {
            manuls_ending = this.manuls_endings.many;
        }

        if (this.super_manuls <= 10n ** 9n) {
            super_manuls_ending = this.get_ending(this.super_manuls, this.manuls_endings);
        } else {
            super_manuls_ending = this.manuls_endings.many;
        }

        if (this.golden_manuls <= 10n ** 9n) {
            golden_manuls_ending = this.get_ending(this.golden_manuls, this.golden_manuls_endings);
        } else {
            golden_manuls_ending = this.golden_manuls_endings.many;
        }
        this.father_progress_display.innerText = `${this.father_progressbar.value}/${this.father_progress_max}`;
        this.manuls_display.innerHTML = `У вас ${normalized_manuls} ${manuls_ending}`;
        this.super_manuls_display.innerHTML = `У вас ${normalized_super_manuls} dead inside ${super_manuls_ending}`;
        this.manuls_per_click_display.innerHTML = `Манулов за клик: ${normalized_manuls_per_click}`;
        this.mother_power_display.innerHTML = `Сила мамы манулов: ${normalized_mother_power}`;
        this.golden_manuls_display.innerHTML = `У вас ${normalized_golden_manuls} ${golden_manuls_ending}`;
        this.father_power_display.innerHTML = `Сила папы манулов: ${
            Number(this.father_power) / 100
        }%`;
        this.clicks_to_gold_manul_display.innerHTML = `1 Золотой манул = ${this.clicks_to_gold_manul} кликов`;
        if (this.grandpa_hasBuff) {
            this.grandpa_buff_display.innerHTML = `Множитель деда манулов: ${normalized_grandpa_buff}`;
        } else {
            this.grandpa_buff_display.innerHTML = 'Множитель деда манулов: Выключен';
        }
    }

    mother_click() {
        this.gold_manuls_check();
        this.manuls_per_click += this.mother_power * this.grandpa_buff_x * this.super_manuls_buff;
        this.update_counter();
    }

    mother_click_new() {
        this.gold_manuls_check();
        this.mother_power += 1n * this.super_manuls_buff;
        this.update_counter();
    }

    father_click() {
        this.gold_manuls_check();
        this.father_progressbar.max = this.father_progress_max;
        this.father_progressbar.value++;
        if (this.father_progressbar.value === this.father_progress_max) {
            this.manuls_per_click +=
                (this.manuls * this.grandpa_buff_x * this.super_manuls_buff) /
                (this.father_power / 100n);
            this.manuls = 0n;
            this.father_progressbar.value = 0;
        }

        this.update_counter();
    }

    grandma_click() {
        this.father_power += this.grandpa_buff_x * this.super_manuls_buff * this.grandma_power;
        this.gold_manuls_check();
        this.update_counter();
    }

    grandpa_click() {
        this.gold_manuls_check();
        this.grandpa_progressbar.value++;
        if (this.grandpa_hasBuff) {
            this.grandpa_progressbar.value--;
        }
        if (this.grandpa_progressbar.value === this.grandpa_progressbar.max) {
            this.grandpa_buff_dur = 250;
            this.grandpa_hasBuff = true;
            this.grandpa_buff_x =
                (this.golden_manuls * (1n + this.mother_power * 100n) * this.super_manuls_buff) /
                2n;
            this.grandpa_progressbar.value = 0;
        }
        this.grandpa_progress_display.innerText = `${this.grandpa_progressbar.value}/${this.grandpa_progressbar.max}`;
        this.update_counter();
    }

    earn_achievement(ach_id) {
        const ach = this.achievements.find(a => a.id === ach_id);
        ach.achieved = true;
        this.unearned_achieves_list = this.unearned_achieves_list.filter(id => id !== ach_id);
        this.earned_achieves_list.push(ach_id)
        document.querySelector(`#${ach_id}`).classList.add('achieved');
        this.create_notification('Получено достижение!', `${ach.title}`);
    }

    achievements_check() {
        this.unearned_achieves_list.forEach(ach_id => {
            const achievement = this.achievements.find(ach => ach.id === ach_id);
            if (achievement.check(this)) {
                this.earn_achievement(ach_id);
            }
        })
        if (this.unearned_achieves_list.length === 0) {
            document.querySelector('#main-button').classList.add('win')
        };
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
                    Цена: ${this.normalize_number(upgrade.price)} ${upgrade.currency}`;
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
            this.manuls += this.manuls_per_click * this.grandpa_buff_x * this.super_manuls_buff;
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

        for (const i in this.achievements) {
            const achievement = document.createElement('div');
            achievement.classList.add('achievement');
            achievement.id = this.achievements[i].id;
            document.querySelector('#achievements-start').appendChild(achievement);
            const title = document.createElement('h1');
            const desc = document.createElement('h1');
            title.innerText = `${this.achievements[i].title}`;
            title.classList.add('achieve-title');
            desc.innerText = `${this.achievements[i].desc}`;
            desc.classList.add('achieve-desc');
            achievement.appendChild(title);
            achievement.appendChild(desc);
        }

        document.querySelector('#manuls_mother').onclick = this.mother_click.bind(this);
        document.querySelector('#father').onclick = this.father_click.bind(this);
        document.querySelector('#manuls_grandma').onclick = this.grandma_click.bind(this);
        document.querySelector('#granddad').onclick = this.grandpa_click.bind(this);

        if (localStorage.getItem(this.save_slot) !== null) {
            this.loadSave();
        }


        if (this.mother_power_itself) {
        document.querySelector('#manuls_mother').onclick = this.mother_click_new.bind(this);
        }

        document.querySelector('#music-button').onclick = () => {
            const audio = document.getElementById('bg-audio');
            if (this.music_playing) {
                audio.pause();
                this.music_playing = false;
            } else {
                audio.play();
                this.music_playing = true;
            }
        };

        document.querySelector('#save-button').onclick = () => {
            this.save();
        };

        document.onkeydown = event => {
            if (event.key == 's' && event.ctrlKey) {
                event.preventDefault();
                this.save();
            }
        };

        this.prompt_bg.onclick = () => {
            this.prompt.classList.add('hidden');
        };

        document.querySelector('#get-save-button').onclick = () => {
            this.prompt_title.innerText = 'Ваш код сохранения:';
            this.prompt_confirm.innerHTML = 'Thank you, sir!';
            this.prompt.classList.remove('hidden');
            this.save_text_area.value = this.save(false);
            this.save_text_area.focus();
            this.save_text_area.select();
            this.prompt_confirm.onclick = () => {
                this.prompt.classList.add('hidden');
            };
        };

        document.querySelector('#load-save-button').onclick = () => {
            this.prompt_title.innerText = 'Введите код сохранения:';
            this.prompt_confirm.innerHTML = 'Подтвердить';
            this.prompt.classList.remove('hidden');
            this.save_text_area.value = '';
            this.save_text_area.focus();
            this.prompt_confirm.onclick = () => {
                this.prompt.classList.add('hidden');
                const save = this.save_text_area.value;
                if (save) {
                    this.loadSave(save);
                }
            };
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

        this.update_counter();

        setInterval(() => this.save(), 1000 * 60);
        setInterval(this.achievements_check.bind(this), 2000);
    }

    create_notification(title, desc) {
        const notification = document.createElement('div');
        document.body.appendChild(notification);
        notification.classList.add('notification');
        document.querySelector('#notif_creator').append(notification);
        notification.innerHTML = `<span>${title}</span></br>
                                  <span style="font-size: 12px;">${desc}</span>`;
        setTimeout(() => notification.remove(), 2800);
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
        this.upgrades.concat(this.special_upgrades).forEach(upgrade => {
            document.querySelector(`#${upgrade.id}`).innerText = `${upgrade.name}
                Цена: ${this.normalize_number(upgrade.price)} ${upgrade.currency}`;
        });

        if (!this.main_buttons_visibility.find(el => el.id === 'father').hidden) {
            document.querySelector('#special-upgrades').classList.remove('hidden');
        }
        if (this.ascend_count > 0) {
            document.querySelector('#god-upgrades').classList.remove('hidden');
        }
    }

    save(should_write = true) {
        const data = JSON.stringify(this, (key, val) => {
            // массив ли
            if (Array.isArray(val)) {
                switch (key) {
                    case 'achievements':
                        return JSON.stringify(val.map(el => el.achieved)); // делаем бул ачивд
                    case 'unearned_achieves_list':
                        return JSON.stringify(val); // массив булов
                    case 'earned_achieves_list':
                        return JSON.stringify(val); // массив булов
                        default:
                        return JSON.stringify(val.map(el => [el.hidden, el.price])); // делаем пары бул бигинт [хидден, цена]

                }
            }
            // иначе
            return !key || // сам объект (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#The_replacer_parameter)
            ['number', 'boolean'].includes(typeof val) || // числа или булы или
                (typeof val === 'string' && val.match(/^[\dabcdef]+$/)) // строки(бигинты в 16бит)
                ? val // само значение this[key]
                : undefined; // скипаем этот key val
        });

        const encoded = toBase64(data);

        if (should_write) {
            localStorage.setItem(this.save_slot, encoded);
            this.create_notification('Игра сохранена!', 'Можешь жить спокойно');
        }

        return encoded;
    }

    loadSave(save) {
        save = save || localStorage.getItem(this.save_slot);
        try {
            const decoded = fromBase64(save);

            this.unearned_achieves_list = []; // при загрузке сейва сначала

            const data = JSON.parse(decoded, (key, val) => {
                if (typeof val === 'string') {
                    if (!!val.match(/^[\dabcdef]+$/)) {
                        return BigInt('0x' + val); // из 16-ричной
                    } else {
                        switch (key) {
                            case 'achievements':
                                return JSON.parse(val).map((isAchieved, i) => {
                                    this[key][i].achieved = isAchieved;
                                    return this[key][i];
                                });
                            case 'unearned_achieves_list':
                                return JSON.parse(val).map((ach_id, i) => {
                                    this.unearned_achieves_list.push(ach_id);
                                    return this.unearned_achieves_list[i];
                                });
                            case 'earned_achieves_list':
                                return JSON.parse(val).map((ach_id, i) => {
                                    this.earned_achieves_list.push(ach_id);
                                    document.querySelector(`#${ach_id}`).classList.add('achieved');
                                    return this.earned_achieves_list[i];
                                });
                            default:
                                return JSON.parse(val).map(([isHidden, itsPrice], i) => {
                                    if (itsPrice) {
                                        this[key][i].price = BigInt('0x' + itsPrice);
                                    }
                                    this[key][i].hidden = isHidden;
                                    return this[key][i];
                                });
                        }
                    }
                }
                return val;
            });

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

window.onload = () => {
    function autoPlay() {
        const audio = document.getElementById('bg-audio');
        audio.src = 'click.mp3';
        audio.volume = 0.25;
        audio.loop = true;

        if (mygame.music_playing) {
            audio.play();
        }

        document.removeEventListener('click', autoPlay);
    }

    document.addEventListener('click', autoPlay);
    mygame.load();
};
