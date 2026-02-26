const { users } = require("./userData");
const { coins } = require("./coinsData");
const {
    creditBundles,
    MIN_TWEET_SCRAPE_COUNT,
    PAYMENT_SESSION_DURATION
    
} = require("./constants");

// ====================

const buttons = {
    // Languages
    select_user_lang_zh: "中文",
    select_user_lang_en: "English",

    // Main Menu
    generate_post: {
        en: "Generate Post",
        zh: "生成推文"
    },
    generate_reply: {
        en: "Generate Reply",
        zh: "生成回复"
    },
    scrape_tweets: {
        en: "Train Model",
        zh: "训练模型"
    },
    purchase_credits: {
        en: "Purchase Credits",
        zh: "购买积分"
    },
    manage_settings: {
        en: "Settings",
        zh: "设置"
    },
    contact_support: {
        en: "Support",
        zh: "客服"
    },

    // Post Generation
    generate_post_news: {
        en: "News Post",
        zh: "新闻推文"
    },
    generate_post_instructed: {
        en: "Instructed Post",
        zh: "指令推文"
    },
    generate_post_engagement: {
        en: "Engagement Post",
        zh: "互动推文"
    },
    refine_post: {
        en: "Refine Post",
        zh: "优化推文"
    },
    post_post: {
        en: "Post on X",
        zh: "发布至 X"
    },
    generate_another_post: {
        en: "Generate Another",
        zh: "再生成"
    },

    // Tweet Scraping
    toggle_scrape_replies: {
        en: "Scrape Replies",
        zh: "抓取回复"
    },
    toggle_scrape_quotes: {
        en: "Scrape Quotes",
        zh: "抓取引用"
    },
    update_scrape_threshold: {
        en: "Threshold Date",
        zh: "起始日期"
    },

    // Purchase Credits
    select_credit_bundle_0: {
        en: `${creditBundles[0].credits} Credits ($${creditBundles[0].price_usd})`,
        zh: `${creditBundles[0].credits} 积分 ($${creditBundles[0].price_usd})`
    },
    select_credit_bundle_1: {
        en: `${creditBundles[1].credits} Credits ($${creditBundles[1].price_usd})`,
        zh: `${creditBundles[1].credits} 积分 ($${creditBundles[1].price_usd})`
    },
    select_payment_method_0: {
        en: `Pay with ${coins[0].symbol}`,
        zh: `${coins[0].symbol}支付`
    },
    select_payment_method_1: {
        en: `Pay with ${coins[1].symbol}`,
        zh: `${coins[1].symbol}支付`
    },
    select_payment_method_2: {
        en: `Pay with ${coins[2].symbol}`,
        zh: `${coins[2].symbol}支付`
    },
    confirm_payment: {
        en: "Confirm Payment",
        zh: "确认支付"
    },

    // Settings
    select_user_lang: {
        en: "Language",
        zh: "语言"
    },
    change_model: {
        en: "AI Model",
        zh: "AI模型"
    },
    update_twitter_identity: {
        en: "X Handle",
        zh: "X账号"
    },

    go_back: {
        en: "Go Back",
        zh: "返回"
    },
};

// ====================

const replies = {
    // Init
    welcome: "Welcome to My X Agent!\n欢迎使用 My X Agent！",
    menu_select_user_lang: "Please select your language.\n请选择您的语言。",
    under_maintenance: {
        en: "🚧 The bot is under maintenance.",
        zh: "🚧 机器人正在维护中。"
    },

    // Twitter Identity
    update_twitter_identity: {
        en: "Please enter an X handle, profile link, or post link. (Case-sensitive)",
        zh: "请输入 X 账号、个人主页链接或推文链接（区分大小写）。"
    },
    process_fetch_twitter_identity: {
        en: "Fetching X profile...",
        zh: "正在获取 X 个人资料..."
    },
    err_fetch_twitter_identity: {
        en: "Couldn't fetch the X profile. Please double-check the handle or link and try again.",
        zh: "无法获取 X 个人资料，请确认账号或链接是否正确后重试。"
    },
    err_insufficient_status_count: {
        en: "This X account doesn't have enough posts to proceed. Please try a different one.",
        zh: "该 X 账号的推文数量不足，请尝试其他账号。"
    },
    err_flagged_user: {
        en: `Your account has been flagged due to multiple unsuccessful attempts. If you believe this is an error, please contact @${process.env.TG_ADMIN_HANDLE}.`,
        zh: `由于多次操作失败，您的账号已被标记。如有疑问，请联系 @${process.env.TG_ADMIN_HANDLE}。`
    },
    err_insufficient_credits_scrape_latest_tweets: {
        en: "You don't have enough credits to scrape latest posts.",
        zh: "积分不足，无法抓取最新推文。"
    },
    process_scrape_latest_tweets: {
        en: "Fetching latest posts...",
        zh: "正在获取最新推文..."
    },
    err_twitter_identity_sync: {
        en: "Failed to fetch the latest posts. Please try again later.",
        zh: "获取最新推文失败，请稍后重试。"
    },
    complete_twitter_identity_sync: {
        en: "The X account is now synced.",
        zh: "X 账号已同步完成。"
    },

    // Menus
    menu_main: {
        en: "Main Menu - Please choose an action below.",
        zh: "主菜单 - 请选择以下操作。"
    },
    menu_generate_post: {
        en: "Post Generation Menu - Please choose an action below.",
        zh: "推文生成菜单 - 请选择以下操作。"
    },
    menu_scrape_tweets: {
        en: "Model Training Menu - Please choose an action below.",
        zh: "模型训练菜单 - 请选择以下操作。"
    },
    menu_purchase_credits: {
        en: "Credits Menu - Please choose an action below.",
        zh: "积分菜单 - 请选择以下操作。"
    },
    menu_select_payment_method: {
        en: "Payment Method Menu - Please choose an action below.",
        zh: "支付方式菜单 - 请选择以下操作。"
    },
    menu_manage_settings: {
        en: "Settings Menu - Please choose an action below.",
        zh: "设置菜单 - 请选择以下操作。"
    },

    // Post Generation
    err_insufficient_credits_generate_post: {
        en: "You don't have enough credits to generate a post.",
        zh: "积分不足，无法生成推文。"
    },
    get_post_instruction: {
        en: "Please provide the instruction for the post.",
        zh: "请输入推文生成指令。"
    },
    process_generate_post: {
        en: "Generating the post...",
        zh: "正在生成推文..."
    },
    err_generate_post: {
        en: "Failed to generate the post.",
        zh: "推文生成失败。"
    },

    // Tweet Refining
    err_insufficient_credits_refine_post: {
        en: "You don't have enough credits to refine a post.",
        zh: "积分不足，无法优化推文。"
    },
    err_insufficient_credits_refine_reply: {
        en: "You don't have enough credits to refine a reply.",
        zh: "积分不足，无法优化回复。"
    },
    get_refine_instruction: {
        en: "Please provide the instruction for the refinement.",
        zh: "请输入优化指令。"
    },
    process_refine_post: {
        en: "Refining the post...",
        zh: "正在优化推文..."
    },
    process_refine_reply: {
        en: "Refining the reply...",
        zh: "正在优化回复..."
    },

    // Tweet Scraping
    get_scrape_count: {
        en: `Enter the number of posts you want to scrape (Minimum: ${MIN_TWEET_SCRAPE_COUNT} posts).`,
        zh: `请输入要抓取的推文数量（最少：${MIN_TWEET_SCRAPE_COUNT} 条）。`
    },
    err_invalid_integer: {
        en: "Invalid input: only positive integers are allowed.",
        zh: "输入无效：仅允许输入正整数。"
    },
    err_min_scrape_count: {
        en: `The number entered is below the minimum of ${MIN_TWEET_SCRAPE_COUNT} posts.`,
        zh: `输入数量低于最小值 ${MIN_TWEET_SCRAPE_COUNT} 条。`
    },
    update_scrape_threshold: {
        en: "Please enter a new date threshold for scraping using the YYYY-MM-DD or YYYY-MM format. (Enter 0 to remove the existing threshold)",
        zh: "请输入新的抓取起始日期，格式为 YYYY-MM-DD 或 YYYY-MM（输入 0 可移除当前起始日期）。"
    },
    err_insufficient_credits_scrape_tweets: {
        en: "You don't have enough credits to scrape this many posts.",
        zh: "积分不足，无法抓取指定数量的推文。"
    },
    complete_add_to_scrape_queue: {
        en: "Your scrape request has been added to the queue.\nYou will be notified once it is complete, and any unused credits will be credited back.",
        zh: "抓取请求已加入队列。\n完成后您将收到通知，未使用的积分将返还。"
    },
    err_scrape_queue_request: {
        en: "Your scrape request couldn't be completed and any unused credits have been refunded.\nPlease try at a later time.",
        zh: "抓取请求未能完成，未使用的积分已返还。\n请稍后再试。"
    },
    complete_scrape_queue_request: {
        en: "Your scrape request has been completed.",
        zh: "抓取请求已完成。"
    },

    // Purchase Credits
    err_select_payment_method: {
        en: "Can't process your request at this time. Please try again later.",
        zh: "当前无法处理您的请求，请稍后重试。"
    },
    err_payment_session_expired: {
        en: "This payment session has expired. Please submit a new request.",
        zh: "支付会话已过期，请重新提交请求。"
    },
    err_payment_not_received: {
        en: "Payment hasn't been received.",
        zh: "尚未收到付款。"
    },
    complete_payment_received: {
        en: "Payment has been received.",
        zh: "已收到付款。"
    },

    contact_support: {
        en: `You can reach out by sending a DM to @${process.env.TG_ADMIN_HANDLE} for any questions, feedback, or assistance.`,
        zh: `如有问题、反馈或需要帮助，请私信联系 @${process.env.TG_ADMIN_HANDLE}。`
    },

    credits_awarded: {
        en: "You’ve been awarded a credit amount of",
        zh: "您已获得积分"
    },
    unflagged_user: {
        en: "Your account has been unflagged. We apologize for the inconvenience.",
        zh: "您的账号已解除标记。给您带来的不便，我们深表歉意。"
    },
};

// ====================

const words = {
    // Init
    lang_zh: "中文",
    lang_en: "English",

    zh: "Chinese",
    en: "English",

    // Purchase Credits
    send: {
        en: "Please send",
        zh: "请发送"
    },
    to_addr_below: {
        en: "to the address below",
        zh: "至下方钱包地址"
    },
    payment_timeframe: {
        en: `within the next ${PAYMENT_SESSION_DURATION / 60} minutes`,
        zh: `请在接下来的 ${PAYMENT_SESSION_DURATION / 60} 分钟内完成付款`
    },
};

// ====================

function getItem(obj, key, userId) {
    if (!userId) return obj[key];

    let prefix = "";
    if (obj === replies) {
        if (key.startsWith("err_")) prefix = "⚠️ ";
        else if (key.startsWith("process_")) prefix = "⏳ ";
        else if (key.startsWith("complete_")) prefix = "✅ ";
    }

    const userLang = users[userId]?.user_lang;
    return prefix + (obj[key]?.[userLang] ?? "");
}

// ====================

function getButton(key, userId) {
    return getItem(buttons, key, userId);
}

function getReply(key, userId) {
    return getItem(replies, key, userId);
}

function getWord(key, userId) {
    return getItem(words, key, userId);
}

// ====================

module.exports = { getButton, getReply, getWord };