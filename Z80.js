
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
	},
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
	//read a byte to reg a from a 16bit address on pc
	LDAmm: function(){Z80._r.a=MMU.rb(MMU.rw(Z80._r.pc)); Z80._r.pc+=2; Z80._r.m=4;Z80._r.t=16;},
	//read a byte from 8bit address on pc to reg c read from next pc address to reg b
	LDBCnn: function(){Z80._r.c=MMU.rb(Z80._r.pc); Z80._r.b=MMU.rb(Z80._r.pc+1);Z80._r.pc+=2; Z80._r.m=3;Z80._r.t = 12;},
	LDDEnn: function(){Z80._r.e=MMU.rb(Z80._r.pc); Z80._r.d=MMU.rb(Z80._r.pc+1);Z80._r.pc+=2; Z80._r.m=3;Z80._r.t = 12;},
	LDHLnn: function(){Z80._r.l=MMU.rb(Z80._r.pc); Z80._r.h=MMU.rb(Z80._r.pc+1);Z80._r.pc+=2; Z80._r.m=3;Z80._r.t = 12;},
	LDSPnn: function(){Z80._r.sp=MMU.rw(Z80._r.pc);Z80._r.pc+=2; Z80._r.m=3;Z80._r.t = 12;},
	//read address from pc and load byte to l and h. 
	LDHLmm: function(){var i=MMU.rw(Z80._r.pc); Z80._r.pc+=2; Z80._r.l=MMU.rb(i); Z80._r.h=MMU.rb(i+1); Z80._r.m=5; Z80._r.t=20;},
	//wtire address from pc to location in regs h<<8 + l
	LDmmHL: function(){var i = MMU.rw(Z80._r.pc); Z80._r.pc+=2; MMU.ww(i,(Z80._r.h<<8)+Z80._r.l); Z80._r.m=5; Z80._r.t=20;},
	//write byte and increment address check for overflow from bottom register
	LDHLIA: function(){MMU.wb((Z80._r.h<<8)+Z80._r.l, Z80._r.a); Z80._r.l=(Z80._r.l+1)&255; if(!Z80._r.l) Z80._r.h=(Z80._r.h+1)&255;Z80._r.m=2;Z80._r.t=8;},
	LDAHLI: function(){Z80._r.a=MMU.rb((Z80._r.h<<8)+Z80._r.l); Z80._r.l=(Z80._r.l+1)&255; if(!Z80._r.l) Z80._r.h=(Z80._r.h+1)&255; Z80._r.m=2;Z80._r.t=8},
	//write byte and decrement address check for underflow
	LDHLDA: function(){MMU.wb((Z80._r.h<<8)+Z80._r.l, Z80._r.a); Z80._r.l=(Z80._r.l-1)&255; if(Z80._r.l==255) Z80._r.h=(Z80._r.h-1)&255;Z80._r.m=2;Z80._r.t=8;},
	LDAHLI: function(){Z80._r.a=MMU.rb((Z80._r.h<<8)+Z80._r.l); Z80._r.l=(Z80._r.l-1)&255; if(Z80._r.l==255) Z80._r.h=(Z80._r.h-1)&255; Z80._r.m=2;Z80._r.t=8},
	//read from addr after 0xFF00 aka halfway in memory addr
	LDAIOn: function(){Z80._r.a=MMU.rb(0xFF00+MMU.rb(Z80._r.pc)); Z80._r.pc++;Z80._r.m=3;Z80._r.t=12},
	LDIOnA: function(){MMU.wb(0xFF00+MMU.rb(Z80._r.pc), Z80._r.a); Z80._r.pc++; Z80._r.m=3;Z80._r.t=12;},
	LDAIOC: function(){Z80._r.a= MMU.rb(0xFF00+Z80._r.c); Z80._r.m=2;Z80._r.t=8}, 
	LDIOCA: function(){MMU.wb(0xFF00+Z80._r.c, Z80._r.a); Z80._r.m=2;Z80._r.t=8}, 
	//
	LDHLSPn: function(){var i=MMU.rb(Z80._r.pc); if(i>27) i-=((~i+1)&255); Z80._r.pc++; i+=Z80._r.sp; Z80._r.h=(i>>8)&255; Z80._r.l=i&255;Z80._rm=3;Z80._r.t=12;},
	//Swap regs val with address in regs function
	SWAPr_b: function(){var tr = Z80._r.b; Z80._r.b=MMU.rb((Z80._r.h<<8)+Z80._r.l); MMU.wb((Z80._r.h<<8)+Z80._r.l, tr); Z80._r.m=4; Z80._r.t=16;},
	SWAPr_a: function(){var tr = Z80._r.a; Z80._r.a=MMU.rb((Z80._r.h<<8)+Z80._r.l); MMU.wb((Z80._r.h<<8)+Z80._r.l, tr); Z80._r.m=4; Z80._r.t=16;},
	SWAPr_c: function(){var tr = Z80._r.c; Z80._r.c=MMU.rb((Z80._r.h<<8)+Z80._r.l); MMU.wb((Z80._r.h<<8)+Z80._r.l, tr); Z80._r.m=4; Z80._r.t=16;},
	SWAPr_d: function(){var tr = Z80._r.d; Z80._r.d=MMU.rb((Z80._r.h<<8)+Z80._r.l); MMU.wb((Z80._r.h<<8)+Z80._r.l, tr); Z80._r.m=4; Z80._r.t=16;},
	SWAPr_e: function(){var tr = Z80._r.e; Z80._r.e=MMU.rb((Z80._r.h<<8)+Z80._r.l); MMU.wb((Z80._r.h<<8)+Z80._r.l, tr); Z80._r.m=4; Z80._r.t=16;},
	SWAPr_h: function(){var tr = Z80._r.h; Z80._r.h=MMU.rb((Z80._r.h<<8)+Z80._r.l); MMU.wb((Z80._r.h<<8)+Z80._r.l, tr); Z80._r.m=4; Z80._r.t=16;},
	SWAPr_l: function(){var tr = Z80._r.l; Z80._r.l=MMU.rb((Z80._r.h<<8)+Z80._r.l); MMU.wb((Z80._r.h<<8)+Z80._r.l, tr); Z80._r.m=4; Z80._r.t=16;},
	//adder functions for all regs
	ADDr_a: function(){Z80._r.a += Z80._r.a;Z80._r.ops.fz(Z80._r.a);if(Z80._r.a > 255) Z80._r.f |=0x10;Z80._r.a &= 255;Z80._r.m = 1;Z80._r.t = 4;}, //Z80._r.opz.fz? 
	ADDr_b: function(){Z80._r.a += Z80._r.b;Z80._r.ops.fz(Z80._r.a);if(Z80._r.a > 255) Z80._r.f |=0x10;Z80._r.a &= 255;Z80._r.m = 1;Z80._r.t = 4;},
	ADDr_c: function(){Z80._r.a += Z80._r.c;Z80._r.ops.fz(Z80._r.a);if(Z80._r.a > 255) Z80._r.f |=0x10;Z80._r.a &= 255;Z80._r.m = 1;Z80._r.t = 4;},
	ADDr_d: function(){Z80._r.a += Z80._r.d;Z80._r.ops.fz(Z80._r.a);if(Z80._r.a > 255) Z80._r.f |=0x10;Z80._r.a &= 255;Z80._r.m = 1;Z80._r.t = 4;},
	ADDr_e: function(){Z80._r.a += Z80._r.e;Z80._r.ops.fz(Z80._r.a);if(Z80._r.a > 255) Z80._r.f |=0x10;Z80._r.a &= 255;Z80._r.m = 1;Z80._r.t = 4;},
	ADDr_h: function(){Z80._r.a += Z80._r.h;Z80._r.ops.fz(Z80._r.a);if(Z80._r.a > 255) Z80._r.f |=0x10;Z80._r.a &= 255;Z80._r.m = 1;Z80._r.t = 4;},
	ADDr_l: function(){Z80._r.a += Z80._r.l;Z80._r.ops.fz(Z80._r.a);if(Z80._r.a > 255) Z80._r.f |=0x10;Z80._r.a &= 255;Z80._r.m = 1;Z80._r.t = 4;},
	//add from address
	ADDHL: function(){Z80._r.a+=MMU.rb((Z80._r.h<<8)+Z80._r.l); Z80.ops.fz(Z80._r.a); if (Z80._r.a > 255) Z80._r,f |=0x10; Z80._r.a&=255; Z80._r.m=2;Z80._r.t=8;},
	ADDn: function(){Z80._r.a+=MMU.rb(Z80._r.pc); Z80._r.pc++; Z80.ops.fz(Z80._r.a); if (Z80._r.a > 255) Z80._r,f |=0x10; Z80._r.a&=255; Z80._r.m=2;Z80._r.t=8;},
	ADDHLBC: function(){var hl=(Z80._r.h<<8)+Z80._r.l; hl+=(Z80._r.b<<8)+Z80._r.c; if(hl>65535) Z80._r.f|=0x10; else Z80._r.f&=0xEF; Z80._r.h=(hl>>8)&255; Z80._r.l=hl&255; Z80._r.m=3;Z80._r.t=12;},
	ADDHLDE: function(){var hl=(Z80._r.h<<8)+Z80._r.l; hl+=(Z80._r.d<<8)+Z80._r.e; if(hl>65535) Z80._r.f|=0x10; else Z80._r.f&=0xEF; Z80._r.h=(hl>>8)&255; Z80._r.l=hl&255; Z80._r.m=3;Z80._r.t=12;},
	ADDHLHL: function(){var hl=(Z80._r.h<<8)+Z80._r.l; hl+=(Z80._r.h<<8)+Z80._r.l; if(hl>65535) Z80._r.f|=0x10; else Z80._r.f&=0xEF; Z80._r.h=(hl>>8)&255; Z80._r.l=hl&255; Z80._r.m=3;Z80._r.t=12;},
	ADDHLSP: function(){var hl=(Z80._r.h<<8)+Z80._r.l; hl+=Z80._r.sp; if(hl>65535) Z80._r.f|=0x10; else Z80._r.f&=0xEF; Z80._r.h=(hl>>8)&255; Z80._r.l=hl&255; Z80._r.m=3;Z80._r.t=12;},
	ADDSPn: function(){var i=MMU.rb(Z80._r.pc); if(i>127) i-=((~i+1)&255); Z80._r.pc++;Z80._r.sp+=i;Z80._r.m=4;Z80._r.t=16;},
	//Add with carry flag
	ADCr_a: function(){Z80._r.a+=Z80._r.a; Z80._r.a+=(Z80._r.f&0x10)?1:0; Z80.ops.fz(Z80._r.a); if(Z80._r.a>255) Z80._r.f |=0x10; Z80._r.a&=255; Z80._r.m=1;Z80._r.t=4;},
	ADCr_b: function(){Z80._r.a+=Z80._r.b; Z80._r.a+=(Z80._r.f&0x10)?1:0; Z80.ops.fz(Z80._r.a); if(Z80._r.a>255) Z80._r.f |=0x10; Z80._r.a&=255; Z80._r.m=1;Z80._r.t=4;},
	ADCr_c: function(){Z80._r.a+=Z80._r.c; Z80._r.a+=(Z80._r.f&0x10)?1:0; Z80.ops.fz(Z80._r.a); if(Z80._r.a>255) Z80._r.f |=0x10; Z80._r.a&=255; Z80._r.m=1;Z80._r.t=4;},
	ADCr_d: function(){Z80._r.a+=Z80._r.d; Z80._r.a+=(Z80._r.f&0x10)?1:0; Z80.ops.fz(Z80._r.a); if(Z80._r.a>255) Z80._r.f |=0x10; Z80._r.a&=255; Z80._r.m=1;Z80._r.t=4;},
	ADCr_e: function(){Z80._r.a+=Z80._r.e; Z80._r.a+=(Z80._r.f&0x10)?1:0; Z80.ops.fz(Z80._r.a); if(Z80._r.a>255) Z80._r.f |=0x10; Z80._r.a&=255; Z80._r.m=1;Z80._r.t=4;},
	ADCr_h: function(){Z80._r.a+=Z80._r.h; Z80._r.a+=(Z80._r.f&0x10)?1:0; Z80.ops.fz(Z80._r.a); if(Z80._r.a>255) Z80._r.f |=0x10; Z80._r.a&=255; Z80._r.m=1;Z80._r.t=4;},
	ADCr_l: function(){Z80._r.a+=Z80._r.l; Z80._r.a+=(Z80._r.f&0x10)?1:0; Z80.ops.fz(Z80._r.a); if(Z80._r.a>255) Z80._r.f |=0x10; Z80._r.a&=255; Z80._r.m=1;Z80._r.t=4;},
	//sub with underflow flag
	SUBr_a: function(){Z80._r.a-=Z80._r.a; Z80.ops.fz(Z80._r.a,1); if(Z80._r.a < 0) Z80._r.f|=0x10; Z80._r.a&=255; Z80._r,m=1;Z80._r.t=4;},
	SUBr_b: function(){Z80._r.a-=Z80._r.b; Z80.ops.fz(Z80._r.a,1); if(Z80._r.a < 0) Z80._r.f|=0x10; Z80._r.a&=255; Z80._r,m=1;Z80._r.t=4;},
	SUBr_c: function(){Z80._r.a-=Z80._r.c; Z80.ops.fz(Z80._r.a,1); if(Z80._r.a < 0) Z80._r.f|=0x10; Z80._r.a&=255; Z80._r,m=1;Z80._r.t=4;},
	SUBr_d: function(){Z80._r.a-=Z80._r.d; Z80.ops.fz(Z80._r.a,1); if(Z80._r.a < 0) Z80._r.f|=0x10; Z80._r.a&=255; Z80._r,m=1;Z80._r.t=4;},
	SUBr_e: function(){Z80._r.a-=Z80._r.e; Z80.ops.fz(Z80._r.a,1); if(Z80._r.a < 0) Z80._r.f|=0x10; Z80._r.a&=255; Z80._r,m=1;Z80._r.t=4;},
	SUBr_h: function(){Z80._r.a-=Z80._r.h; Z80.ops.fz(Z80._r.a,1); if(Z80._r.a < 0) Z80._r.f|=0x10; Z80._r.a&=255; Z80._r,m=1;Z80._r.t=4;},
	SUBr_l: function(){Z80._r.a-=Z80._r.l; Z80.ops.fz(Z80._r.a,1); if(Z80._r.a < 0) Z80._r.f|=0x10; Z80._r.a&=255; Z80._r,m=1;Z80._r.t=4;},
	//Sub with underflow flags for memory functions
	SUBrHL: function(){Z80._r.a-=MMU.rb((Z80._r.h<<8)+Z80._r.l); Z80.ops.fz(Z80._r.a, 1); if(Z80._r.a < 0)Z80._r.f|=0x10; Z80._r.a&=255;Z80._r.m=2;Z80._r.t=8;},
	SUBn: function(){Z80._r.a-=MMU.rb(Z80._r.pc); Z80._r.pc++; Z80._r.ops.fz(Z80._r.a,1); if(Z80._r.a<0)Z80._r.f|=0x10; Z80._r.a&=255; Z80._r.m=2;Z80._r.t=8},

}
