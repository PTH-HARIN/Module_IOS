/**
 * CapCut Pro Unlock
 * Bắt response /commerce/v1/subscription/user_info và các endpoint tương tự
 * Ép trạng thái Pro / VIP
 */

const url = $request.url || "";
let body = $response.body;

if (!body) {
  $done({});
}

try {
  let obj = JSON.parse(body);

  // Trường hợp response chuẩn CapCut commerce
  // ret === "0" && errmsg === "success"
  if (obj.ret !== undefined || obj.data !== undefined || obj.flag !== undefined) {
    // Ép success
    if (obj.ret !== undefined) obj.ret = "0";
    if (obj.errmsg !== undefined) obj.errmsg = "success";
    if (obj.message !== undefined) obj.message = "success";

    // Đảm bảo có object data
    if (!obj.data || typeof obj.data !== "object") {
      obj.data = {};
    }

    const data = obj.data;

    // ===== VIP / Pro flags =====
    data.is_vip = true;
    data.is_pro = true;
    data.isPro = true;
    data.vip = true;
    data.pro = true;
    data.flag = true;
    data.subscribe_type = "pro";
    data.vip_type = 1;
    data.vip_level = "pro";
    data.level = "pro";
    data.product_level = "pro";
    data.membership_type = "pro";
    data.subscribe_status = 1;
    data.is_subscribe = true;
    data.has_subscribed = true;

    // Thời hạn dài
    const now = Math.floor(Date.now() / 1000);
    const farFuture = now + 10 * 365 * 24 * 3600; // ~10 năm

    data.start_time = now;
    data.expire_time = farFuture;
    data.end_time = farFuture;
    data.vip_end_time = farFuture;
    data.pro_end_time = farFuture;
    data.expireTime = farFuture;
    data.startTime = now;

    // Nested pro object (một số bản dùng)
    data.pro_info = data.pro_info || {};
    data.pro_info.is_pro = true;
    data.pro_info.level = "pro";
    data.pro_info.expire_time = farFuture;
    data.pro_info.start_time = now;

    data.vip_info = data.vip_info || {};
    data.vip_info.is_vip = true;
    data.vip_info.vip_type = 1;
    data.vip_info.expire_time = farFuture;

    // Subscription list nếu có
    if (!data.subscription_list) {
      data.subscription_list = [];
    }
    if (Array.isArray(data.subscription_list) && data.subscription_list.length === 0) {
      data.subscription_list.push({
        product_id: "capcut.pro.yearly",
        is_active: true,
        start_time: now,
        end_time: farFuture,
        level: "pro"
      });
    }

    // Credits / storage (nếu app check)
    if (data.credit === undefined) data.credit = 99999;
    if (data.ai_credit === undefined) data.ai_credit = 99999;
    if (data.space_capacity === undefined) data.space_capacity = 1099511627776; // 1TB

    body = JSON.stringify(obj);
  }
} catch (e) {
  // Không parse được JSON thì để nguyên
}

$done({ body });
