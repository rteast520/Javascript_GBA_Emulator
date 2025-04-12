
Z80 = {
	//time clock m and t
	_clock: {m:0, t:0},

	//registers of the Z80
	_r: {
		a:0, b:0, c:0, d:0, e:0, h:0, l:0, f:0, /*F is a flag register producres Zero, Operation, Halfcarry and carry*/
		pc:0, sp:0,
		m:0, t:0
	},

	//adds e to a nad leaves result in reg a
	ADDr_e: function(){
		Z80._r.a += Z80._r.e; //add
		z80._r.f = 0; //clear flag
		if(!(Z80._r.a & 255)) Z80._r.f |=0x80; //check for zero
		if(Z80._r.a > 255) Z80._r.f |= 0x10; //check for a carry
		Z80._r.a &= 255; //mask bits into a
		//update time regs
		Z80._r.m = 1;
		Z80._r.t = 4; 
	},
	// Compare function: comp b to a and sets compare flag
	CPr_b: function(){
		var i = Z80._r.a; // copy a
		i -= Z80._r.b; // subtract b from temp_a
		Z80._r.f |= 0x40; //set sub flag
		if(!(i & 255)) Z80._r.f |= 0x80; //check zero
		if(i<0) Z80._r.f |= 10; //check underflow
		//Update time regs
		Z80._r.m = 1; 
		Z80._r.t = 4;
	}
	//NOP function
	NOP: function(){
		//update time regs
		Z80._r.m = 1; Z80._r.t = 4;
	},
	// push to stack b and C
	PUSHBC: function(){
		Z80._r.sp--;  //decrement stack pointer to byte beggining
		MMU.wb(Z80._r.sp, Z80._r.b); //write reg b to mem stack
		Z80._r.sp --; //decrement stack pointer to byte beginning
		MMU.wb(Z80._r.sp, Z80._r.c); //write reg c to mem stack
		//update time regs
		Z80._r.m = 3;
		Z80._r.t = 12;
	},
	//pop regs h and l off the stack
	POPHL: function(){
		Z80._r.l = MMU.rb(Z80._r.sp); //read off the top of the stack
		Z80._r.sp ++; //increment the stack pointer
		Z80._r.h = MMU.rb(Z80._r.sp); //read top of the stack pointer
		Z80._r.sp ++; //increment stack pointer
		//update time regs
		Z80._r.m = 3;
		Z80._r.t = 12
	},
	//reads byte from location offset by addr
	LDAmm: function(){
		var addr = MMU.rw(Z80._r.pc); //read word addr of pc
		Z80._r.pc += 2; // increment the pc reg by two bytes
		Z80._r.a = MMU.rb(addr); //read the byte from the address and store in a
		//update time regs
		Z80._r.m = 4;
		Z80._r.t = 16;

	},
	//reset cpu at startup/ and reset
	reset: function(){
		Z80._r.a = 0; Z80._r.b=0;Z80._r.c=0;Z80._r.d=0;Z80._r.e=0;Z80._r.f=0;
		Z80._r.h=0;Z80._r.l=0;Z80._r.sp=0;
		Z80._r.pc=0 //execution at zero
		Z80._r.m = 0;
		Z80._r.t = 0;
	},

	//cross register loads format operation destination and reg to load
	LDrr_aa: function(){Z80._r.a = Z80._r.a; Z80._r.m = 1; Z80._r.t = 4;},
	LDrr_ab: function(){Z80._r.a = Z80._r.b; Z80._r.m = 1; Z80._r.t = 4;},
	LDrr_ac: function(){Z80._r.a = Z80._r.c; Z80._r.m = 1; Z80._r.t = 4;},
	LDrr_ad: function(){Z80._r.a = Z80._r.d; Z80._r.m = 1; Z80._r.t = 4;},
	LDrr_ae: function(){Z80._r.a = Z80._r.e; Z80._r.m = 1; Z80._r.t = 4;},
	LDrr_ah: function(){Z80._r.a = Z80._r.h; Z80._r.m = 1; Z80._r.t = 4;},
	LDrr_al: function(){Z80._r.a = Z80._r.l; Z80._r.m = 1; Z80._r.t = 4;},

	LDrr_ba: function(){Z80._r.b = Z80._r.a; Z80._r.m = 1; Z80._r.t = 4;},
	LDrr_bb: function(){Z80._r.b = Z80._r.b; Z80._r.m = 1; Z80._r.t = 4;},
	LDrr_bc: function(){Z80._r.b = Z80._r.c; Z80._r.m = 1; Z80._r.t = 4;},
	LDrr_bd: function(){Z80._r.b = Z80._r.d; Z80._r.m = 1; Z80._r.t = 4;},
	LDrr_be: function(){Z80._r.b = Z80._r.e; Z80._r.m = 1; Z80._r.t = 4;},
	LDrr_bh: function(){Z80._r.b = Z80._r.h; Z80._r.m = 1; Z80._r.t = 4;},
	LDrr_bl: function(){Z80._r.b = Z80._r.l; Z80._r.m = 1; Z80._r.t = 4;},

	LDrr_ca: function(){Z80._r.c = Z80._r.a; Z80._r.m = 1; Z80._r.t = 4;},
	LDrr_cb: function(){Z80._r.c = Z80._r.b; Z80._r.m = 1; Z80._r.t = 4;},
	LDrr_cc: function(){Z80._r.c = Z80._r.c; Z80._r.m = 1; Z80._r.t = 4;},
	LDrr_cd: function(){Z80._r.c = Z80._r.d; Z80._r.m = 1; Z80._r.t = 4;},
	LDrr_ce: function(){Z80._r.c = Z80._r.e; Z80._r.m = 1; Z80._r.t = 4;},
	LDrr_ch: function(){Z80._r.c = Z80._r.h; Z80._r.m = 1; Z80._r.t = 4;},
	LDrr_cl: function(){Z80._r.c = Z80._r.l; Z80._r.m = 1; Z80._r.t = 4;},

	LDrr_da: function(){Z80._r.d = Z80._r.a; Z80._r.m = 1; Z80._r.t = 4;},
	LDrr_db: function(){Z80._r.d = Z80._r.b; Z80._r.m = 1; Z80._r.t = 4;},
	LDrr_dc: function(){Z80._r.d = Z80._r.c; Z80._r.m = 1; Z80._r.t = 4;},
	LDrr_dd: function(){Z80._r.d = Z80._r.d; Z80._r.m = 1; Z80._r.t = 4;},
	LDrr_de: function(){Z80._r.d = Z80._r.e; Z80._r.m = 1; Z80._r.t = 4;},
	LDrr_dh: function(){Z80._r.d = Z80._r.h; Z80._r.m = 1; Z80._r.t = 4;},
	LDrr_dl: function(){Z80._r.d = Z80._r.l; Z80._r.m = 1; Z80._r.t = 4;},

	LDrr_ea: function(){Z80._r.e = Z80._r.a; Z80._r.m = 1; Z80._r.t = 4;},
	LDrr_eb: function(){Z80._r.e = Z80._r.b; Z80._r.m = 1; Z80._r.t = 4;},
	LDrr_ec: function(){Z80._r.e = Z80._r.c; Z80._r.m = 1; Z80._r.t = 4;},
	LDrr_ed: function(){Z80._r.e = Z80._r.d; Z80._r.m = 1; Z80._r.t = 4;},
	LDrr_ee: function(){Z80._r.e = Z80._r.e; Z80._r.m = 1; Z80._r.t = 4;},
	LDrr_eh: function(){Z80._r.e = Z80._r.h; Z80._r.m = 1; Z80._r.t = 4;},
	LDrr_el: function(){Z80._r.e = Z80._r.l; Z80._r.m = 1; Z80._r.t = 4;},

	LDrr_ha: function(){Z80._r.h = Z80._r.a; Z80._r.m = 1; Z80._r.t = 4;},
	LDrr_hb: function(){Z80._r.h = Z80._r.b; Z80._r.m = 1; Z80._r.t = 4;},
	LDrr_hc: function(){Z80._r.h = Z80._r.c; Z80._r.m = 1; Z80._r.t = 4;},
	LDrr_hd: function(){Z80._r.h = Z80._r.d; Z80._r.m = 1; Z80._r.t = 4;},
	LDrr_he: function(){Z80._r.h = Z80._r.e; Z80._r.m = 1; Z80._r.t = 4;},
	LDrr_hh: function(){Z80._r.h = Z80._r.h; Z80._r.m = 1; Z80._r.t = 4;},
	LDrr_hl: function(){Z80._r.h = Z80._r.l; Z80._r.m = 1; Z80._r.t = 4;},

	LDrr_la: function(){Z80._r.l = Z80._r.a; Z80._r.m = 1; Z80._r.t = 4;},
	LDrr_lb: function(){Z80._r.l = Z80._r.b; Z80._r.m = 1; Z80._r.t = 4;},
	LDrr_lc: function(){Z80._r.l = Z80._r.c; Z80._r.m = 1; Z80._r.t = 4;},
	LDrr_ld: function(){Z80._r.l = Z80._r.d; Z80._r.m = 1; Z80._r.t = 4;},
	LDrr_le: function(){Z80._r.l = Z80._r.e; Z80._r.m = 1; Z80._r.t = 4;},
	LDrr_lh: function(){Z80._r.l = Z80._r.h; Z80._r.m = 1; Z80._r.t = 4;},
	LDrr_ll: function(){Z80._r.l = Z80._r.l; Z80._r.m = 1; Z80._r.t = 4;},
	
	//load value to reg address is pc <<8 + l reg
	LDrHLm_a: function(){Z80._r.a=MMU.rb((Z80._r.pc<<8)+Z80._r.l); Z80._r.m = 2; Z80._r.t = 8;},
	LDrHLm_b: function(){Z80._r.b=MMU.rb((Z80._r.pc<<8)+Z80._r.l); Z80._r.m = 2; Z80._r.t = 8;},
	LDrHLm_c: function(){Z80._r.c=MMU.rb((Z80._r.pc<<8)+Z80._r.l); Z80._r.m = 2; Z80._r.t = 8;},
	LDrHLm_d: function(){Z80._r.d=MMU.rb((Z80._r.pc<<8)+Z80._r.l); Z80._r.m = 2; Z80._r.t = 8;},
	LDrHLm_e: function(){Z80._r.e=MMU.rb((Z80._r.pc<<8)+Z80._r.l); Z80._r.m = 2; Z80._r.t = 8;},
	LDrHLm_h: function(){Z80._r.h=MMU.rb((Z80._r.pc<<8)+Z80._r.l); Z80._r.m = 2; Z80._r.t = 8;},
	LDrHLm_l: function(){Z80._r.l=MMU.rb((Z80._r.pc<<8)+Z80._r.l); Z80._r.m = 2; Z80._r.t = 8;},

	//wrtie word after h roate left and add reg l
	LDHLmr_a: function(){MMU.wb((Z80._r.h<<8)+Z80._r.l, Z80._r.a); Z80._r.m=2;Z80._r.t=8;},
	LDHLmr_b: function(){MMU.wb((Z80._r.h<<8)+Z80._r.l, Z80._r.b); Z80._r.m=2;Z80._r.t=8;},
	LDHLmr_c: function(){MMU.wb((Z80._r.h<<8)+Z80._r.l, Z80._r.c); Z80._r.m=2;Z80._r.t=8;},
	LDHLmr_d: function(){MMU.wb((Z80._r.h<<8)+Z80._r.l, Z80._r.d); Z80._r.m=2;Z80._r.t=8;},
	LDHLmr_e: function(){MMU.wb((Z80._r.h<<8)+Z80._r.l, Z80._r.e); Z80._r.m=2;Z80._r.t=8;},
	LDHLmr_h: function(){MMU.wb((Z80._r.h<<8)+Z80._r.l, Z80._r.h); Z80._r.m=2;Z80._r.t=8;},
	LDHLmr_l: function(){MMU.wb((Z80._r.h<<8)+Z80._r.l, Z80._r.l); Z80._r.m=2;Z80._r.t=8;},

	//load to reg x from pc
	LDrn_a: function(){Z80._r.a=MMU.rb(Z80._r.pc); Z80._r.pc++; Z80._r.m = 2; Z80._r.t=8;},
	LDrn_b: function(){Z80._r.b=MMU.rb(Z80._r.pc); Z80._r.pc++; Z80._r.m = 2; Z80._r.t=8;},
	LDrn_c: function(){Z80._r.c=MMU.rb(Z80._r.pc); Z80._r.pc++; Z80._r.m = 2; Z80._r.t=8;},
	LDrn_d: function(){Z80._r.d=MMU.rb(Z80._r.pc); Z80._r.pc++; Z80._r.m = 2; Z80._r.t=8;},
	LDrn_e: function(){Z80._r.e=MMU.rb(Z80._r.pc); Z80._r.pc++; Z80._r.m = 2; Z80._r.t=8;},
	LDrn_h: function(){Z80._r.h=MMU.rb(Z80._r.pc); Z80._r.pc++; Z80._r.m = 2; Z80._r.t=8;},
	LDrn_l: function(){Z80._r.l=MMU.rb(Z80._r.pc); Z80._r.pc++; Z80._r.m = 2; Z80._r.t=8;},

	//read a byte from the pc stack and write it to heap at h<<8 + l
	LDHLmn: function(){MMU.wb((Z80._r.h<<8)+Z80._r.l, MMU.rb(Z80._r.pc)); Z80._r.pc++; Z80._r.m=3; Z80._r.t=12;},
	//load word from b<<8 + c to reg a
	LDBCmA: function(){MMU.wb((Z80._r.b <<8)+Z80._r.c, Z80._r.a); Z80._r.m=2;Z80._r.t=8;},
	LDDEmA: function(){MMU.wb((Z80._r.d <<8)+Z80._r.e, Z80._r.a); Z80._r.m=2;Z80._r.t=8;},
	//
	LDmmA: function(){MMU.wb(MMU.rw(Z80._r.pc), Z80._r.a); Z80._r.pc+=2; Z80._r.m=4; Z80._r.t=16;},
	// load byte from address b<<8+c to reg a
	LDABCm: function() {Z80._r.a=MMU.rb((Z80._r.b<<8)+Z80._r.c); Z80._r.m=2;Z80._r.t=8;},
	LDADEm: function() {Z80._r.a=MMU.rb((Z80._r.d<<8)+Z80._r.e); Z80._r.m=2;Z80._r.t=8;},
	//
	LDAmm: function(){Z80._r.a=MMU.rb(MMU.rw(Z80._r.pc)); Z80._r.pc+=2; Z80._r.m=4;Z80._r.t=16;},

}
