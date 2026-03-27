"use strict";exports.id=8814,exports.ids=[8814],exports.modules={3355:(a,b,c)=>{c.d(b,{JW:()=>z,AJ:()=>B,Ps:()=>C,_Z:()=>A});var d=c(91488);c(27806);var e=c(69206),f=c(91837),g=c(88480),h=c(5194),i=c(43899),j=c(62927);let k=j.Ik({id:j.Yj().min(1)}),l=k.extend({type:j.eu("text"),content:j.Yj().min(1,"Text block content is required")}),m=k.extend({type:j.eu("image"),mediaId:j.Yj().min(1).optional(),url:j.Yj().min(1,"Image URL is required"),alt:j.Yj().optional(),caption:j.Yj().optional()}),n=k.extend({type:j.eu("quote"),quote:j.Yj().min(1,"Quote content is required"),attribution:j.Yj().optional()}),o=k.extend({type:j.eu("divider")}),p=k.extend({type:j.eu("link"),url:j.Yj().url("Link URL must be valid"),label:j.Yj().min(1,"Link label is required"),openInNewTab:j.zM().default(!0)}),q=k.extend({type:j.eu("video"),url:j.Yj().url("Video URL must be valid"),caption:j.Yj().optional()}),r=j.gM("type",[l,m,n,o,p,q]),s=j.Ik({version:j.eu(2),blocks:j.YO(r).min(1,"At least one content block is required")});function t(a){let b=s.safeParse(a);return b.success?b.data.blocks.filter(a=>"image"===a.type).map(a=>a.mediaId).filter(a=>!!a):[]}var u=c(50954);async function v(a){let b=await g.db.insight.findUnique({where:{id:a},select:{id:!0,slug:!0,title:!0,excerpt:!0,status:!0,publishedAt:!0}});if(!b||"PUBLISHED"!==b.status)return;let c=await g.db.newsletterSubscriber.findMany({where:{status:"ACTIVE"},select:{id:!0,email:!0,unsubscribeToken:!0}});if(0===c.length)return;let d=new Set((await g.db.insightEmailDispatch.findMany({where:{insightId:b.id},select:{subscriberId:!0}})).map(a=>a.subscriberId)),e=c.filter(a=>!d.has(a.id));if(0!==e.length)for(let a=0;a<e.length;a+=20){let c=e.slice(a,a+20);await Promise.allSettled(c.map(async a=>{if(await (0,u.Mm)(a.email,{title:b.title,excerpt:b.excerpt,slug:b.slug},a.unsubscribeToken))try{await g.db.insightEmailDispatch.create({data:{insightId:b.id,subscriberId:a.id}})}catch(a){console.error("Failed to create insight dispatch record:",a)}})),a+20<e.length&&await new Promise(a=>setTimeout(a,400))}}var w=c(16800),x=c(40410);let y=j.Ik({title:j.Yj().min(1,"Title is required"),slug:j.Yj().min(1,"Slug is required"),excerpt:j.Yj().optional(),contentJson:j.bz(),contentHtml:j.Yj().optional(),status:j.k5(["DRAFT","PUBLISHED","ARCHIVED"]),authorId:j.Yj().optional(),categoryId:j.Yj().optional(),coverImageId:j.Yj().optional(),metaTitle:j.Yj().optional(),metaDescription:j.Yj().optional(),publishedAt:j.Yj().optional(),featuredAt:j.Yj().optional()});async function z(a){try{let b=await (0,h.oC)(),c={title:a.get("title"),slug:a.get("slug"),excerpt:a.get("excerpt")||void 0,contentJson:JSON.parse(a.get("contentJson")||"{}"),contentHtml:a.get("contentHtml")||void 0,status:a.get("status")||"DRAFT",authorId:a.get("authorId")||void 0,categoryId:a.get("categoryId")||void 0,coverImageId:a.get("coverImageId")||void 0,metaTitle:a.get("metaTitle")||void 0,metaDescription:a.get("metaDescription")||void 0,publishedAt:a.get("publishedAt")||void 0,featuredAt:a.get("featuredAt")||void 0},d=y.parse(c),i=s.safeParse(d.contentJson);if(!i.success)return{success:!1,error:"Invalid content blocks. Please fix the editor blocks and try again.",fieldErrors:{contentJson:i.error.issues.map(a=>a.message)}};if(await g.db.insight.findUnique({where:{slug:d.slug}}))return{success:!1,error:"Slug already exists",fieldErrors:{slug:["This slug is already in use"]}};let j=await g.db.insight.create({data:{title:d.title,slug:d.slug,excerpt:d.excerpt,contentJson:i.data,contentHtml:d.contentHtml,status:d.status,authorId:d.authorId,categoryId:d.categoryId,coverImageId:d.coverImageId,metaTitle:d.metaTitle,metaDescription:d.metaDescription,publishedAt:d.publishedAt?new Date(d.publishedAt):null,featuredAt:d.featuredAt?new Date(d.featuredAt):null,createdById:b.id}}),k=a.getAll("tagIds");k.length>0&&await g.db.insightTag.createMany({data:k.map(a=>({insightId:j.id,tagId:a}))});let l=t(i.data),m=Array.from(new Set([...d.coverImageId?[d.coverImageId]:[],...l]));m.length>0&&await g.db.media.updateMany({where:{id:{in:m}},data:{insightId:j.id}}),"PUBLISHED"===d.status&&await v(j.id),(0,f.revalidatePath)("/admin/insights"),(0,f.revalidatePath)("/insights"),(0,e.redirect)("/admin/insights")}catch(a){if(a instanceof w.G)return{success:!1,error:"Validation failed",fieldErrors:a.flatten().fieldErrors};if(a instanceof Error&&"NEXT_REDIRECT"===a.message)throw a;return console.error("Create insight error:",a),{success:!1,error:"Failed to create insight. Please try again."}}}async function A(a,b){try{await (0,h.oC)();let c={title:b.get("title"),slug:b.get("slug"),excerpt:b.get("excerpt")||void 0,contentJson:JSON.parse(b.get("contentJson")||"{}"),contentHtml:b.get("contentHtml")||void 0,status:b.get("status")||"DRAFT",authorId:b.get("authorId")||void 0,categoryId:b.get("categoryId")||void 0,coverImageId:b.get("coverImageId")||void 0,metaTitle:b.get("metaTitle")||void 0,metaDescription:b.get("metaDescription")||void 0,publishedAt:b.get("publishedAt")||void 0,featuredAt:b.get("featuredAt")||void 0},d=y.parse(c),i=s.safeParse(d.contentJson);if(!i.success)return{success:!1,error:"Invalid content blocks. Please fix the editor blocks and try again.",fieldErrors:{contentJson:i.error.issues.map(a=>a.message)}};if(await g.db.insight.findFirst({where:{slug:d.slug,NOT:{id:a}}}))return{success:!1,error:"Slug already exists",fieldErrors:{slug:["This slug is already in use"]}};let j=await g.db.insight.findUnique({where:{id:a},select:{status:!0}});if(!j)return{success:!1,error:"Insight not found."};await g.db.insight.update({where:{id:a},data:{title:d.title,slug:d.slug,excerpt:d.excerpt,contentJson:i.data,contentHtml:d.contentHtml,status:d.status,authorId:d.authorId,categoryId:d.categoryId,coverImageId:d.coverImageId,metaTitle:d.metaTitle,metaDescription:d.metaDescription,publishedAt:d.publishedAt?new Date(d.publishedAt):null,featuredAt:d.featuredAt?new Date(d.featuredAt):null}}),await g.db.insightTag.deleteMany({where:{insightId:a}});let k=b.getAll("tagIds");k.length>0&&await g.db.insightTag.createMany({data:k.map(b=>({insightId:a,tagId:b}))});let l=t(i.data),m=Array.from(new Set([...d.coverImageId?[d.coverImageId]:[],...l]));await g.db.media.updateMany({where:{insightId:a,...m.length>0?{id:{notIn:m}}:{}},data:{insightId:null}}),m.length>0&&await g.db.media.updateMany({where:{id:{in:m}},data:{insightId:a}}),"PUBLISHED"!==j.status&&"PUBLISHED"===d.status&&await v(a),(0,f.revalidatePath)("/admin/insights"),(0,f.revalidatePath)(`/admin/insights/${a}/edit`),(0,f.revalidatePath)("/insights"),(0,f.revalidatePath)(`/insights/${d.slug}`),(0,e.redirect)("/admin/insights")}catch(a){if(a instanceof w.G)return{success:!1,error:"Validation failed",fieldErrors:a.flatten().fieldErrors};if(a instanceof Error&&"NEXT_REDIRECT"===a.message)throw a;return console.error("Update insight error:",a),{success:!1,error:"Failed to update insight. Please try again."}}}async function B(a){try{return await (0,h.oC)(),await g.db.insight.delete({where:{id:a}}),(0,f.revalidatePath)("/admin/insights"),(0,f.revalidatePath)("/insights"),{success:!0}}catch(a){return console.error("Delete insight error:",a),{success:!1,error:"Failed to delete insight. Please try again."}}}async function C(a){return(0,i.z9)(a)}(0,x.D)([z,A,B,C]),(0,d.A)(z,"401fafc4eb0eff26930887c70601711ed4bd0de35c",null),(0,d.A)(A,"603fe84d5e845db184bd0a6fbc5f603f76b50c0c04",null),(0,d.A)(B,"40a0cfea691a416490661edf4e7bf59ec307dc74c0",null),(0,d.A)(C,"40a5e0ec5bc26538a3da6fff077e04e9583cb5ae81",null)},43899:(a,b,c)=>{c.d(b,{z9:()=>d});function d(a){return a.toLowerCase().trim().replace(/[^\w\s-]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-").replace(/^-+|-+$/g,"")}},50954:(a,b,c)=>{c.d(b,{Cw:()=>h,Mm:()=>j,Pe:()=>g});var d=c(32132);let e=null;async function f(a){try{let b=function(){if(e)return e;let a=process.env.SMTP_HOST,b=process.env.SMTP_PORT,c=process.env.SMTP_USER,f=process.env.SMTP_PASS;if(!a||!b||!c||!f)throw Error("SMTP configuration is incomplete. Please check environment variables.");return e=d.createTransport({host:a,port:parseInt(b,10),secure:"true"===process.env.SMTP_SECURE,auth:{user:c,pass:f},connectionTimeout:1e4,greetingTimeout:1e4,socketTimeout:15e3})}(),c=process.env.SMTP_FROM||"noreply@spx.com",f=process.env.SMTP_FROM_NAME||"SPX",g=c.includes("<")&&c.includes(">")?c:`${f} <${c}>`,h=b.sendMail({from:g,to:a.to,subject:a.subject,text:a.text,html:a.html}),i=new Promise((a,b)=>setTimeout(()=>b(Error("SMTP send timed out")),2e4));return await Promise.race([h,i]),!0}catch(a){return console.error("Email send error:",a),!1}}async function g(a){let b=process.env.CONTACT_TO_EMAIL||process.env.ADMIN_EMAIL||"hello@spx.com",c=`
New Contact Form Submission

Name: ${a.name}
Email: ${a.email}
${a.organization?`Organization: ${a.organization}`:""}
${a.phone?`Phone: ${a.phone}`:""}
Inquiry Type: ${a.inquiryType}

Message:
${a.message}
  `.trim(),d=`
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #00BFFF; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px; }
    .field { margin-bottom: 15px; }
    .label { font-weight: 600; color: #374151; margin-bottom: 5px; }
    .value { color: #1f2937; }
    .message-box { background: white; padding: 15px; border-radius: 6px; border: 1px solid #e5e7eb; margin-top: 10px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2 style="margin: 0;">New Contact Form Submission</h2>
    </div>
    <div class="content">
      <div class="field">
        <div class="label">Name:</div>
        <div class="value">${a.name}</div>
      </div>
      <div class="field">
        <div class="label">Email:</div>
        <div class="value"><a href="mailto:${a.email}">${a.email}</a></div>
      </div>
      ${a.organization?`
      <div class="field">
        <div class="label">Organization:</div>
        <div class="value">${a.organization}</div>
      </div>
      `:""}
      ${a.phone?`
      <div class="field">
        <div class="label">Phone:</div>
        <div class="value">${a.phone}</div>
      </div>
      `:""}
      <div class="field">
        <div class="label">Inquiry Type:</div>
        <div class="value">${a.inquiryType}</div>
      </div>
      <div class="field">
        <div class="label">Message:</div>
        <div class="message-box">${a.message.replace(/\n/g,"<br>")}</div>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();return f({to:b,subject:`New Contact Inquiry: ${a.inquiryType}`,text:c,html:d})}async function h(a){let b=`
Dear ${a.name},

Thank you for reaching out to SPX. We've received your inquiry regarding "${a.inquiryType}" and will respond within 1-2 business days.

For urgent matters, please contact us directly at ${process.env.CONTACT_TO_EMAIL||"hello@spx.com"}.

Best regards,
The SPX Team
  `.trim(),c=`
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #00BFFF; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: white; padding: 30px; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px; }
    .footer { text-align: center; margin-top: 20px; padding: 20px; color: #6b7280; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0; font-size: 24px;">SPX</h1>
    </div>
    <div class="content">
      <p>Dear ${a.name},</p>
      <p>Thank you for reaching out to SPX. We've received your inquiry regarding <strong>"${a.inquiryType}"</strong> and will respond within 1-2 business days.</p>
      <p>For urgent matters, please contact us directly at <a href="mailto:${process.env.CONTACT_TO_EMAIL||"hello@spx.com"}" style="color: #00BFFF;">${process.env.CONTACT_TO_EMAIL||"hello@spx.com"}</a>.</p>
      <p>Best regards,<br>The SPX Team</p>
    </div>
    <div class="footer">
      This is an automated confirmation. Please do not reply to this email.
    </div>
  </div>
</body>
</html>
  `.trim();return f({to:a.email,subject:"Thank you for contacting SPX",text:b,html:c})}function i(a){return a.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}async function j(a,b,c){let d=process.env.APP_URL||"http://localhost:3002",e=`${d.replace(/\/$/,"")}/insights/${b.slug}`,g=`${d.replace(/\/$/,"")}/newsletter/unsubscribe/${encodeURIComponent(c)}`,h=i(b.title),j=b.excerpt?i(b.excerpt):"",k=`
New SPX insight published:
${b.title}

Read it: ${e}

${b.excerpt||""}

Unsubscribe: ${g}
  `.trim(),l=`
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #00BFFF; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: white; padding: 30px; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px; }
    .btn { display: inline-block; margin-top: 16px; background: #111827; color: white !important; text-decoration: none; padding: 10px 16px; border-radius: 6px; font-weight: 600; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0; font-size: 24px;">New SPX Insight</h1>
    </div>
    <div class="content">
      <h2 style="margin-top: 0;">${h}</h2>
      ${j?`<p>${j}</p>`:""}
      <a class="btn" href="${e}">Read the full insight</a>
      <p style="margin-top: 18px; color: #6b7280; font-size: 14px;">If the button does not work, use this link: ${e}</p>
      <p style="margin-top: 12px; color: #6b7280; font-size: 14px;"><a href="${g}">Unsubscribe from future insight emails</a></p>
    </div>
  </div>
</body>
</html>
  `.trim();return f({to:a,subject:`New Insight: ${b.title}`,text:k,html:l})}},77296:(a,b,c)=>{c.d(b,{A:()=>e});var d=c(85708);let e=(0,d.createServerReference)("40a0cfea691a416490661edf4e7bf59ec307dc74c0",d.callServer,void 0,d.findSourceMapURL,"deleteInsightAction")}};