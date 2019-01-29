package org.springframework.samples.petclinic.web.api;

import static org.mockito.BDDMockito.given;
import static org.mockito.Matchers.anyObject;
import static org.mockito.Mockito.doAnswer;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.invocation.InvocationOnMock;
import org.mockito.stubbing.Answer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.samples.petclinic.model.Vet;
import org.springframework.samples.petclinic.service.ClinicService;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;

@RunWith(SpringRunner.class)
@WebMvcTest(VetResource.class)
public class VetResourceTests {

	@Autowired
	private MockMvc mvc;

	@MockBean
	ClinicService clinicService;

	@Test
	public void shouldGetAListOfVetsInJSonFormat() throws Exception {

		Vet vet = new Vet();
		vet.setId(1);

		given(clinicService.findVets()).willReturn(Arrays.asList(vet));

		mvc.perform(get("/api/vets.json") //
				.accept(MediaType.APPLICATION_JSON)) //
				.andExpect(status().isOk()) //
				.andExpect(jsonPath("$[0].id").value(1));
	}

	@Test
	public void shouldNotGetVetById() throws Exception {

		mvc.perform(get("/api/vet/10") //
				.accept(MediaType.APPLICATION_JSON)) //
				.andExpect(status().is4xxClientError()) //
				.andExpect(content().contentType("application/json")); //

	}

	@Test
	public void shouldGetVetById() throws Exception {
		given(clinicService.findVetById(1)).willReturn(setupVets().get(1));

		mvc.perform(get("/api/vet/1") //
				.accept(MediaType.APPLICATION_JSON)) //
				.andExpect(status().isOk()) //
				.andExpect(content().contentType("application/json;charset=UTF-8")) //
				.andExpect(jsonPath("$.id").value(1)) //
				.andExpect(jsonPath("$.firstName").value("Hein")) //
				.andExpect(jsonPath("$.lastName").value("Mueck")); //
	}

	@Test
	public void shouldCreateVet() throws Exception {

		doAnswer(new Answer<Void>() {
			public Void answer(InvocationOnMock invocation) {
				Vet receivedVet = (Vet) invocation.getArguments()[0];
				receivedVet.setId(666);
				return null;
			}
		}).when(clinicService).saveVet((Vet) anyObject());

		final Vet newVet = setupVets().get(0);
		newVet.setId(null);

		ObjectMapper mapper = new ObjectMapper();
		String vetAsJsonString = mapper.writeValueAsString(newVet);
		newVet.setId(666);
		String newVetAsJsonString = mapper.writeValueAsString(newVet);

		mvc.perform(post("/api/vet") //
				.content(vetAsJsonString).accept(MediaType.APPLICATION_JSON).contentType(MediaType.APPLICATION_JSON)) //
				.andExpect(status().isCreated()).andExpect(content().json(newVetAsJsonString));
	}

	@Test
	public void shouldReturnBindingErrors() throws Exception {

		final Vet newVet = setupVets().get(0);
		newVet.setId(null);
		newVet.setLastName(null);

		ObjectMapper mapper = new ObjectMapper();
		String vetAsJsonString = mapper.writeValueAsString(newVet);

		mvc.perform(post("/api/vet") //
				.content(vetAsJsonString).accept(MediaType.APPLICATION_JSON).contentType(MediaType.APPLICATION_JSON)) //
				.andExpect(status().isUnprocessableEntity()).andExpect(content().contentType("application/json")) //
				.andExpect(jsonPath("$.fieldErrors.lastName").isNotEmpty()) //

		;
	}

	private List<Vet> setupVets() {

		final List<Vet> vets = new LinkedList<Vet>();

		Vet vet = new Vet();
		vet.setId(0);
		vet.setFirstName("Klaus-Dieter");
		vet.setLastName("Mueller");
		vets.add(vet);

		vet = new Vet();
		vet.setId(1);
		vet.setFirstName("Hein");
		vet.setLastName("Mueck");
		vets.add(vet);

		vet = new Vet();
		vet.setId(2);
		vet.setFirstName("Peter");
		vet.setLastName("Mueller");
		vets.add(vet);

		return vets;

	}
}