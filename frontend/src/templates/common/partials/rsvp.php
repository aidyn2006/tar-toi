<section class="section reveal" id="rsvpSection">
  <h2 class="heading">Қатысамын</h2>
  <form class="rsvp-form" id="rsvpForm" onsubmit="event.preventDefault(); submitRSVP();">
    <input id="rName" name="name" placeholder="Аты-жөні" required>
    <input id="rPhone" name="phone" placeholder="Телефон" required>
    <div class="rsvp-guests">
      <button type="button" class="btn gc-btn" onclick="changeGuests(-1)">−</button>
      <input id="rGuests" value="1" readonly>
      <button type="button" class="btn gc-btn" onclick="changeGuests(1)">+</button>
    </div>
    <textarea id="rNote" name="note" rows="3" placeholder="Ескерту"></textarea>
    <div class="rsvp-cta">
      <button type="submit" class="btn submit-btn" id="rsvpBtn">Растау</button>
    </div>
  </form>
  <div class="success-msg" id="successMsg">Рахмет! Күтеміз.</div>
</section>
